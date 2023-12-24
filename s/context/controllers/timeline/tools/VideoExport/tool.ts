import {XClip, XTimeline} from "../../types.js"
import {FFmpegHelper} from "../../helpers/FFmpegHelper/helper.js"
import {FileSystemHelper} from "../../helpers/FileSystemHelper/helper.js"

export class VideoExport {
	#worker = new Worker(new URL("./worker.js", import.meta.url), {type: "module"})
	#file: Uint8Array | null = null
	#FFmpegHelper = new FFmpegHelper()
	#FileSystemHelper = new FileSystemHelper()

	constructor() {
		this.#worker.addEventListener("message", async (msg: MessageEvent<{chunks: Uint8Array, type: string}>) => {
			if(msg.data.type === "export-end") {
				const binary_container_name = "raw.h264"
				await this.#FFmpegHelper.write_binary_into_container(msg.data.chunks, binary_container_name)
				await this.#FFmpegHelper.mux(binary_container_name, "test.mp4")
				const muxed_file = await this.#FFmpegHelper.get_muxed_file()
				this.#file = muxed_file
			}
		})
	}

	async save_file() {
		const handle = await this.#FileSystemHelper.getFileHandle()
		await this.#FileSystemHelper.writeFile(handle, this.#file!)
	}

	async export_start(timeline: XTimeline) {
		const sorted_clips = this.#sort_clips_by_track(timeline.clips)
		this.#worker.postMessage({clips: sorted_clips})
	}

	#sort_clips_by_track(clips: XClip[]) {
		const sorted_clips = clips.sort((a, b) => {
			if(a.track < b.track) return 1
				else return -1
		})
		return sorted_clips
	}
}
