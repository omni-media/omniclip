
import Renraku from "@e280/renraku"

import {MediaSplitter, type MediaPart} from "./splitter.js"
import type {MediaAnalysisApi} from "../../../../../../../server/parts/assistant/analysis.js"

export const mediaAnalysis: Renraku.Remote<MediaAnalysisApi> = Renraku.httpRemote<MediaAnalysisApi>({url: "/api/analyze"})

export type VideoPart = Omit<MediaPart, "blob"> & {fileName: string}

export class VideoContext {
	#uploaded = 0

	constructor(
		readonly projectId: string,
		readonly source: Blob,
		readonly onUploadProgress: (progress: number) => void,
	) {}

	/**
	* If necessary split the video into parts first
	* before providing to keep it within cloud model limits
	* */
	async provide() {
		const parts: VideoPart[] = []
		const splitter = new MediaSplitter(this.source)

		for await (const {blob, start, end} of splitter.split()) {
			const fileName = await this.#upload(blob)
			this.#uploaded += blob.size
			parts.push({fileName, start, end})
		}

		return parts
	}

	async #upload(source: Blob) {
		const target = await mediaAnalysis.uploadTarget({projectId: this.projectId})
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
		return target.fileName
	}
}

