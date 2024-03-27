import {generate_id} from "@benev/slate/x/tools/generate_id.js"

import {FPSCounter} from "./tools/FPSCounter/tool.js"
import {TimelineActions} from "../timeline/actions.js"
import {Compositor} from "../compositor/controller.js"
import {FFmpegHelper} from "./helpers/FFmpegHelper/helper.js"
import {FileSystemHelper} from "./helpers/FileSystemHelper/helper.js"
import {AnyEffect, VideoEffect, XTimeline} from "../timeline/types.js"
import {get_effects_at_timestamp} from "./utils/get_effects_at_timestamp.js"

interface DecodedFrame {
	frame: VideoFrame
	effect_id: string
	timestamp: number
	frames_count: number
	frame_id: string
}

export class VideoExport {
	#encode_worker = new Worker(new URL("./encode_worker.js", import.meta.url), {type: "module"})
	#file: Uint8Array | null = null
	#FileSystemHelper = new FileSystemHelper()

	#timebase = 25
	#timestamp = 0
	#timestamp_end = 0
	readonly canvas = document.createElement("canvas")
	ctx = this.canvas.getContext("2d")!

	decoded_effects = new Map<string, string>()
	decoded_frames: Map<string, DecodedFrame> = new Map()
	#FPSCounter: FPSCounter

	constructor(private actions: TimelineActions, private ffmpeg: FFmpegHelper, private compositor: Compositor) {
		this.canvas.width = 1280
		this.canvas.height = 720
		this.#FPSCounter = new FPSCounter(this.actions.set_fps, 100)
	}

	set_timebase(timebase: number) {
		this.#timebase = timebase
		this.#encode_worker.postMessage({action: "update-timebase"})
	}

	async save_file() {
		const handle = await this.#FileSystemHelper.getFileHandle()
		await this.#FileSystemHelper.writeFile(handle, this.#file!)
	}

	export_start(timeline: XTimeline) {
		const sorted_effects = this.#sort_effects_by_track(timeline.effects)
		this.#timestamp_end = Math.max(...sorted_effects.map(effect => effect.start_at_position - effect.start + effect.end))
		this.#export_process(sorted_effects)
		this.actions.set_is_exporting(true)
	}

	#find_closest_effect_frame(effect: VideoEffect, timestamp: number) {
		let closest: DecodedFrame | null = null
		let current_difference = Number.MAX_SAFE_INTEGER
		this.decoded_frames.forEach(frame => {
			if(frame.effect_id === effect.id) {
				const difference = Math.abs(frame.timestamp - timestamp)
				if(difference < current_difference) {
					current_difference = difference
					closest = frame
				}
			}
		})
		return closest!
	}

	#remove_stale_chunks(effect_id: string, thresholdTimestamp: number) {
		const timebase_in_ms = 1000/this.#timebase
		const entriesToRemove: string[] = []

		/* margin to keep about one frame more incase its needed,
		* for some reason sometimes its needed, but im lazy to fix it */
		const margin_for_additional_frame = timebase_in_ms * 1.5

		this.decoded_frames.forEach((value, key) => {
				if (value.effect_id === effect_id && value.timestamp < thresholdTimestamp - margin_for_additional_frame) {
						entriesToRemove.push(key)
				}
		});

		entriesToRemove.forEach(key => {
				const decoded = this.decoded_frames.get(key)
				decoded?.frame.close()
				this.decoded_frames.delete(key)
		})
	}

	#clear_canvas() {
		this.ctx?.clearRect(0, 0, 1280, 720)
	}

	async #export_process(effects: AnyEffect[]) {
		this.#clear_canvas()
		const effects_at_timestamp = get_effects_at_timestamp(effects, this.#timestamp)
		const draw_queue: (() => void)[] = []
		let frame_duration = null

		for(const effect of effects_at_timestamp) {
			if(effect.kind === "video") {
				const {frame, frames_count, frame_id, effect_id} = await this.#get_frame_from_video(effect, this.#timestamp)
				frame_duration = effect.duration / frames_count
				draw_queue.push(() => {
					this.ctx?.drawImage(frame, 0, 0, this.canvas.width, this.canvas.height)
					frame.close()
					this.#remove_stale_chunks(effect_id, this.#timestamp)
					this.decoded_frames.delete(frame_id)
				})
			}
			if(effect.kind === "text") {
				draw_queue.push(() => this.compositor.TextManager.draw_text(effect, this.ctx))
			}
			else if(effect.kind === "image") {
				draw_queue.push(async () => this.compositor.ImageManager.draw_image_frame(effect))
			}
		}

		this.actions.set_export_status("composing")
		for(const draw of draw_queue) {draw()}
		this.#encode_composed_frame(this.canvas, 1000/this.#timebase)

		this.#timestamp += 1000/this.#timebase

		const progress = this.#timestamp / this.#timestamp_end * 100 // for progress bar
		this.actions.set_export_progress(progress)

		if(Math.ceil(this.#timestamp) >= this.#timestamp_end) {
			this.actions.set_export_status("flushing")
			this.#encode_worker.postMessage({action: "get-binary"})
			this.#encode_worker.onmessage = async (msg) => {
				if(msg.data.action === "binary") {
					const composed_data_input_name = "composed.h264"
					const output_name = "output.mp4"
					await this.ffmpeg.write_composed_data(msg.data.binary, composed_data_input_name)
					await this.ffmpeg.merge_audio_with_video_and_mux(effects, composed_data_input_name, output_name, this.compositor)
					const muxed_file = await this.ffmpeg.get_muxed_file(output_name)
					this.#file = muxed_file
					this.actions.set_export_status("complete")
				}
			}
			return
		}
		requestAnimationFrame(() => {
			this.#export_process(effects)
			this.#FPSCounter.update()
		})
	}

	#frame_config(canvas: HTMLCanvasElement, duration: number): VideoFrameInit {
		return {
			displayWidth: canvas.width,
			displayHeight: canvas.height,
			duration,
			timestamp: this.#timestamp * 1000
		}
	}

	#encode_composed_frame(canvas: HTMLCanvasElement, duration: number) {
		const frame = new VideoFrame(canvas, this.#frame_config(canvas, duration))
		this.#encode_worker.postMessage({frame, action: "encode"})
		frame.close()
	}

	#get_frame_from_video(effect: VideoEffect, timestamp: number): Promise<DecodedFrame> {
		if(!this.decoded_effects.has(effect.id)) {
			this.#extract_frames_from_video(effect, timestamp)
		}
		return new Promise((resolve) => {
			const decoded = this.#find_closest_effect_frame(effect, timestamp)
			if(decoded) {
				resolve(decoded)
			} else {
				const interval = setInterval(() => {
					const decoded = this.#find_closest_effect_frame(effect, timestamp)
					if(decoded) {
						resolve(decoded)
						clearInterval(interval)
					}
				}, 100)
			}
		})
	}

	#extract_frames_from_video(effect: VideoEffect, timestamp: number) {
		this.actions.set_export_status("demuxing")
		const worker = new Worker(new URL("./decode_worker.js", import.meta.url), {type: "module"})
		worker.addEventListener("message", (msg) => {
			if(msg.data.action === "new-frame") {
				const id = generate_id()
				this.decoded_frames.set(id, {...msg.data.frame, frame_id: id})
			}
		})
		const {file} = this.compositor.VideoManager.get(effect.id)!
		worker.postMessage({action: "demux", effect: {
			...effect,
			file
		}, starting_timestamp: timestamp, timebase: this.#timebase})
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
