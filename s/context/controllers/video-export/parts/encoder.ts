import {AnyEffect} from "../../../types.js"
import {Actions} from "../../../actions.js"
import {Media} from "../../media/controller.js"
import {Compositor} from "../../compositor/controller.js"
import {FFmpegHelper} from "../helpers/FFmpegHelper/helper.js"

export class Encoder {
	encode_worker = new Worker(new URL("./encode_worker.js", import.meta.url), {type: "module"})
	#ffmpeg: FFmpegHelper
	file: Uint8Array | null = null
	#is_frame_encoded = false

	constructor(private actions: Actions, private compositor: Compositor, private media: Media) {
		this.#ffmpeg = new FFmpegHelper(actions)
		this.encode_worker.onmessage = async (msg) => {
			if(msg.data.action === "encoded") {
				this.#is_frame_encoded = true
			}
		}
	}

	export_process_end(effects: AnyEffect[]) {
		this.actions.set_export_status("flushing")
		this.encode_worker.postMessage({action: "get-binary"})
		this.encode_worker.onmessage = async (msg) => {
			if(msg.data.action === "binary") {
				const output_name = "output.mp4"
				await this.#ffmpeg.write_composed_data(msg.data.binary, "composed.h264")
				await this.#ffmpeg.merge_audio_with_video_and_mux(effects, "composed.h264", "output.mp4", this.media)
				const muxed_file = await this.#ffmpeg.get_muxed_file(output_name)
				this.file = muxed_file
				this.actions.set_export_status("complete")
			}
		}
		return
	}

	async encode_composed_frame(canvas: HTMLCanvasElement, timestamp: number) {
		const frame = new VideoFrame(canvas, this.#frame_config(canvas, timestamp))
		this.encode_worker.postMessage({frame, action: "encode"})
		frame.close()
		// return new Promise((resolve) => {
		// 	this.#encode_worker.addEventListener("message", async (msg) => {
		// 		if(msg.data.action === "encoded") {
		// 			console.log("ENCODED1")
		// 			resolve(true)
		// 			// this.#is_frame_encoded = true
		// 		}
		// 	}, {once: true})
		// })
		// await this.#isFrameEncoded()
	}

	#isFrameEncoded() {
		return new Promise((resolve) => {
			if(this.#is_frame_encoded) {
				resolve(true)
			} else {
				const interval = setInterval(() => {
					if(this.#is_frame_encoded) {
						resolve(true)
						this.#is_frame_encoded = false
						clearInterval(interval)
					}
				}, 1)
			}
		})
	}

	#frame_config(canvas: HTMLCanvasElement, timestamp: number): VideoFrameInit {
		return {
			displayWidth: canvas.width,
			displayHeight: canvas.height,
			duration: 1000/this.compositor.timebase,
			timestamp: timestamp * 1000
		}
	}

	configure([width, height]: number[], bitrate: number) {
		this.encode_worker.postMessage({action: "configure", width, height, bitrate})
	}

}
