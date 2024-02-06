import {fetchFile} from "@ffmpeg/util/dist/esm/index.js"

import {TimelineActions} from "../timeline/actions.js"
import {Compositor} from "../compositor/controller.js"
import {FFmpegHelper} from "./helpers/FFmpegHelper/helper.js"
import {FileSystemHelper} from "./helpers/FileSystemHelper/helper.js"
import {AnyEffect, VideoEffect, XTimeline} from "../timeline/types.js"
import {get_effects_at_timestamp} from "./utils/get_effects_at_timestamp.js"

export class VideoExport {
	#worker = new Worker(new URL("./worker/worker.js", import.meta.url), {type: "module"})
	#file: Uint8Array | null = null
	#FileSystemHelper = new FileSystemHelper()
	#timestamp = 0
	#timestamp_end = 0
	readonly canvas = document.createElement("canvas")
	ctx = this.canvas.getContext("2d")!
	decoded_effects = new Map<string, string>()

	constructor(private actions: TimelineActions, private ffmpeg: FFmpegHelper, private compositor: Compositor) {
		this.canvas.width = 1280
		this.canvas.height = 720

		this.#worker.addEventListener("message", async (msg: MessageEvent<{binary: Uint8Array, progress: number, action: string}>) => {
			if(msg.data.action === "binary") {
				const binary_container_name = "raw.h264"
				await ffmpeg.write_binary_into_container(msg.data.binary, binary_container_name)
				await ffmpeg.mux(binary_container_name, "test.mp4")
				const muxed_file = await ffmpeg.get_muxed_file()
				this.#file = muxed_file
			}
		})
	}

	async save_file() {
		const handle = await this.#FileSystemHelper.getFileHandle()
		await this.#FileSystemHelper.writeFile(handle, this.#file!)
	}

	export_start(timeline: XTimeline) {
		const sorted_effects = this.#sort_effects_by_track(timeline.effects)
		this.#timestamp_end = Math.max(...sorted_effects.map(effect => effect.start_at_position + effect.duration))
		this.export_process(sorted_effects)
		this.actions.set_is_exporting(true)
	}

	async export_process(effects: AnyEffect[]) {
		const effects_at_timestamp = get_effects_at_timestamp(effects, this.#timestamp)
		const draw_queue: (() => void)[] = []
		for(const effect of effects_at_timestamp) {
			if(effect.kind === "video") {
				const frame = await this.#get_frame_from_video(effect)
				draw_queue.push(() => this.ctx?.drawImage(frame, 0, 0, this.canvas.width, this.canvas.height))
			}
			if(effect.kind === "text") {
				draw_queue.push(() => this.compositor.TextManager.draw_text(effect, this.ctx))
			}
		}
		for(const draw of draw_queue) {draw()}
		this.#encode_composed_frame(this.canvas)

		this.#timestamp += 1000/30
		const progress = this.#timestamp / this.#timestamp_end * 100 // for progress bar
		this.actions.set_export_progress(progress)
		if(this.#timestamp >= this.#timestamp_end) {
			this.#worker.postMessage({action: "get-binary"})
			return
		}

		requestAnimationFrame(() => this.export_process(effects))
	}

	get #frame_config(): VideoFrameInit {
		return {
			displayWidth: this.canvas.width,
			displayHeight: this.canvas.height,
			duration: 1000000/30,
			timestamp: this.#timestamp * 1000
		}
	}

	#encode_composed_frame(canvas: HTMLCanvasElement) {
		const frame = new VideoFrame(canvas, this.#frame_config)
		this.#worker.postMessage({frame, action: "encode"})
	}

	async #get_frame_from_video(effect: VideoEffect) {
		if(!this.decoded_effects.has(effect.id)) {
			await this.#extract_frames_from_video(effect)
		}
		const current_time = this.get_effect_current_time_relative_to_timecode(effect, this.#timestamp)
		const frame_number = Math.ceil(current_time / (1000/30))
		const frame_data = await this.ffmpeg.ffmpeg.readFile(`out${effect.id}_${frame_number}.png`)
		return await createImageBitmap(new Blob([frame_data]))
	}

	async #extract_frames_from_video(effect: VideoEffect) {
		const file_result = await fetchFile(effect.file)
		await this.ffmpeg.ffmpeg.writeFile(effect.file.name, file_result)
		await this.ffmpeg.ffmpeg.exec(["-i", effect.file.name, `out${effect.id}_%d.png`])
		this.decoded_effects.set(effect.id, effect.id)
	}

	get_effect_current_time_relative_to_timecode(effect: AnyEffect, timecode: number) {
		const current_time = timecode - effect.start_at_position
		return current_time
	}

	#sort_effects_by_track(effects: AnyEffect[]) {
		const sorted_effects = [...effects].sort((a, b) => {
			if(a.track < b.track) return 1
			else return -1
		})
		return sorted_effects
	}

}
