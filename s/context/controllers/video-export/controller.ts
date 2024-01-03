import {AnyEffect, XTimeline} from "../timeline/types.js"
import {FFmpegHelper} from "./helpers/FFmpegHelper/helper.js"
import {FileSystemHelper} from "./helpers/FileSystemHelper/helper.js"

export class VideoExport {
	#worker = new Worker(new URL("./worker/worker.js", import.meta.url), {type: "module"})
	#file: Uint8Array | null = null
	#FFmpegHelper = new FFmpegHelper()
	#FileSystemHelper = new FileSystemHelper()

	constructor() {
		this.#worker.addEventListener("message", async (msg: MessageEvent<{chunks: Uint8Array, type: string}>) => {
			if(msg.data.type === "export-end") {
				console.log(msg.data.chunks.length)
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
		console.log(timeline.effects)
		const sorted_effects = this.#sort_effects_by_track(timeline.effects)
		this.#worker.postMessage({effects: sorted_effects})
	}

	#sort_effects_by_track(effects: AnyEffect[]) {
		console.log(effects)
		const sorted_effects = [...effects].sort((a, b) => {
			if(a.track < b.track) return 1
				else return -1
		})
		return sorted_effects
	}
}
