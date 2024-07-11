import {generate_id} from "@benev/slate"

import {Encoder} from "./encoder.js"
import {Actions} from "../../../actions.js"
import {Media} from "../../media/controller.js"
import {demuxer} from "../../../../tools/demuxer.js"
import {Compositor} from "../../compositor/controller"
import {AnyEffect, VideoEffect} from "../../../types.js"
import {get_effects_at_timestamp} from "../utils/get_effects_at_timestamp.js"

interface DecodedFrame {
	frame: VideoFrame
	effect_id: string
	timestamp: number
	frames_count: number
	frame_id: string
}

export class Decoder {
	decoded_frames: Map<string, DecodedFrame> = new Map()
	decoded_effects = new Map<string, string>()

	constructor(private actions: Actions, private media: Media, private compositor: Compositor, private encoder: Encoder) {}

	async get_and_draw_decoded_frame(effects: AnyEffect[], timestamp: number) {
		const effects_at_timestamp = get_effects_at_timestamp(effects, timestamp)
		for(const effect of effects_at_timestamp) {
			if(effect.kind === "video") {
				const {frame, frame_id} = await this.#get_frame_from_video(effect, timestamp)
				this.compositor.managers.videoManager.draw_decoded_frame(effect, frame)
				frame.close()
				this.decoded_frames.delete(frame_id)
			}
		}
	}

	#get_frame_from_video(effect: VideoEffect, timestamp: number): Promise<DecodedFrame> {
		if(!this.decoded_effects.has(effect.id)) {
			this.#extract_frames_from_video(effect, timestamp)
		}
		return new Promise((resolve) => {
			const decoded = this.#find_closest_effect_frame(effect)
			if(decoded) {
				resolve(decoded)
			} else {
				const interval = setInterval(() => {
					const decoded = this.#find_closest_effect_frame(effect)
					if(decoded) {
						resolve(decoded)
						clearInterval(interval)
					}
				}, 100)
			}
		})
	}

	async #extract_frames_from_video(effect: VideoEffect, timestamp: number) {
		this.actions.set_export_status("demuxing")
		const worker = new Worker(new URL("./decode_worker.js", import.meta.url), {type: "module"})
		worker.addEventListener("message", (msg) => {
			if(msg.data.action === "new-frame") {
				const id = generate_id()
				this.decoded_frames.set(id, {...msg.data.frame, frame_id: id})
			}
			if(msg.data.action === "end") {
				Array.from(this.decoded_frames.values()).forEach(value => {
					if(value.effect_id === effect.id) {
						this.decoded_frames.delete(value.frame_id)
					}
				})
			}
		})
		const file = await this.media.get_file(effect.file_hash)
		worker.postMessage({action: "demux", effect: {...effect}, starting_timestamp: timestamp, frames: effect.frames, timebase: this.compositor.timebase})
		demuxer(
			file!,
			this.encoder.encode_worker,
			effect.start,
			effect.end === effect.duration ? effect.raw_duration : effect.end,
			(config) => worker.postMessage({action: "configure", config}),
			(chunk) => worker.postMessage({action: "chunk", chunk}),
		)
		this.decoded_effects.set(effect.id, effect.id)
	}

	#find_closest_effect_frame(effect: VideoEffect) {
		const frame = Array.from(this.decoded_frames.values()).filter(frame => frame.effect_id === effect.id).sort((a, b) => a.timestamp - b.timestamp)[0]
		if(frame) {
			return frame
		}
	}
}
