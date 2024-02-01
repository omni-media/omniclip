import {TimelineActions} from "../timeline/actions.js"
import {AnyEffect, XTimeline} from "../timeline/types.js"
import {FFmpegHelper} from "./helpers/FFmpegHelper/helper.js"
import {FileSystemHelper} from "./helpers/FileSystemHelper/helper.js"

export class VideoExport {
	#worker = new Worker(new URL("./worker/worker.js", import.meta.url), {type: "module"})
	#file: Uint8Array | null = null
	#FileSystemHelper = new FileSystemHelper()
	readonly canvas = document.createElement("canvas")

	constructor(private actions: TimelineActions, ffmpeg: FFmpegHelper) {
		this.#worker.addEventListener("message", async (msg: MessageEvent<{chunks: Uint8Array, progress: number, type: string}>) => {
			if(msg.data.type === "export-end") {
				const binary_container_name = "raw.h264"
				await ffmpeg.write_binary_into_container(msg.data.chunks, binary_container_name)
				await ffmpeg.mux(binary_container_name, "test.mp4")
				const muxed_file = await ffmpeg.get_muxed_file()
				this.#file = muxed_file
			}
			if(msg.data.type === "progress") {
				actions.set_export_progress(msg.data.progress)
			}
		})
	}

	async save_file() {
		const handle = await this.#FileSystemHelper.getFileHandle()
		await this.#FileSystemHelper.writeFile(handle, this.#file!)
	}

	export_start(timeline: XTimeline) {
		const sorted_effects = this.#sort_effects_by_track(timeline.effects)
		const offscreen = this.canvas.transferControlToOffscreen()
		this.#worker.postMessage({effects: sorted_effects, canvas: offscreen}, [offscreen])
		this.actions.set_is_exporting(true)
	}

	#sort_effects_by_track(effects: AnyEffect[]) {
		const sorted_effects = [...effects].sort((a, b) => {
			if(a.track < b.track) return 1
				else return -1
		})
		return sorted_effects
	}
}
