
import type {UploadedPart} from "@omnimedia/omniso/api"

import {MediaSplitter} from "./splitter.js"
import {mediaAnalysisClient} from "../../../../api.js"

export class VideoContext {
	#uploaded = 0

	constructor(
		readonly projectId: string,
		readonly mediaHash: string,
		readonly source: Blob,
		readonly onUploadProgress: (progress: number) => void,
	) {}

	/**
	* If necessary split the video into parts first
	* before providing to keep it within cloud model limits
	* */
	async provide() {
		const manifestPath = `${this.#prefix}/complete.json`
		const uploaded = await mediaAnalysisClient.getUploadedParts({
			projectId: this.projectId,
			path: manifestPath,
		})
		if (uploaded) return uploaded

		const parts: UploadedPart[] = []
		const splitter = new MediaSplitter(this.source)

		for await (const {blob, start, end} of splitter.split()) {
			const path = `${this.#prefix}/${start}s-${end}s.mp4`
			await this.#upload(blob, path)
			this.#uploaded += blob.size
			parts.push({path, start, end})
		}

		await this.#upload(new Blob([JSON.stringify(parts)], {type: "application/json"}), manifestPath)
		return parts
	}

	get #prefix() {
		return `${this.projectId}/${this.mediaHash}`
	}

	async #upload(source: Blob, path: string) {
		const target = await mediaAnalysisClient.uploadTarget({
			projectId: this.projectId,
			path,
		})
		await new Promise<void>((resolve, reject) => {
			const request = new XMLHttpRequest()
			request.open("PUT", target.uploadUrl)
			request.setRequestHeader("content-type", source.type || "video/mp4")
			request.upload.onprogress = event => {
				if (event.lengthComputable)
					this.onUploadProgress(Math.min((this.#uploaded + source.size * event.loaded / event.total) / this.source.size, 1))
			}
			request.onerror = () => reject(new Error("R2 upload failed"))
			request.onload = () => {
				if (request.status >= 200 && request.status < 300) resolve()
				else reject(new Error(`R2 upload failed: ${request.status} ${request.responseText}`))
			}
			request.send(source)
		})
	}
}

