
import type {UploadedPart} from "@omnimedia/omniso/api"

import {onAbort} from "./abort.js"
import type {MediaSplitter} from "./splitter.js"
import {mediaAnalysisClient} from "../../../../api.js"

export class MediaContext {
	#uploaded = 0

	constructor(
		readonly projectId: string,
		readonly cacheKey: string,
		readonly splitter: MediaSplitter,
		readonly onUploadProgress: (progress: number) => void,
	) {}

	/** Upload the supplied parts, reusing the cached manifest when available. */
	async provide() {
		this.splitter.signal?.throwIfAborted()

		const manifestPath = `${this.#prefix}/complete.json`
		const uploaded = await mediaAnalysisClient.getUploadedParts({
			projectId: this.projectId,
			path: manifestPath,
		})
		if (uploaded) return uploaded

		const parts: UploadedPart[] = []

		for await (const {blob, start, end} of this.splitter.split()) {
			const path = `${this.#prefix}/${start}s-${end}s${this.splitter.extension}`
			await this.#upload(blob, path)
			this.#uploaded += blob.size
			parts.push({path, start, end})
		}

		await this.#upload(new Blob([JSON.stringify(parts)], {type: "application/json"}), manifestPath)
		return parts
	}

	get #prefix() {
		return `${this.projectId}/${this.cacheKey}`
	}

	async #upload(source: Blob, path: string) {
		const {signal} = this.splitter

		signal?.throwIfAborted()

		const target = await mediaAnalysisClient.uploadTarget({
			projectId: this.projectId,
			path,
		})

		signal?.throwIfAborted()

		await new Promise<void>((resolve, reject) => {
			const request = new XMLHttpRequest()
			request.open("PUT", target.uploadUrl)
			request.setRequestHeader("content-type", source.type || "video/mp4")
			request.upload.onprogress = event => {
				if (event.lengthComputable)
					this.onUploadProgress(Math.min((this.#uploaded + source.size * event.loaded / event.total) / this.splitter.source.size, 1))
			}
			request.onerror = () => reject(new Error("R2 upload failed"))
			request.onload = () => {
				if (request.status >= 200 && request.status < 300) resolve()
				else reject(new Error(`R2 upload failed: ${request.status} ${request.responseText}`))
			}

			request.onabort = () => reject(signal?.reason ?? new Error("Upload cancelled"))
			request.onloadend = onAbort(signal, () => request.abort())
			request.send(source)
		})
	}
}

