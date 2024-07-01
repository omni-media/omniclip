import {generate_id} from "@benev/slate"

import {Actions} from "../../../actions.js"
import {Media} from "../../media/controller.js"
import {Compositor} from "../../compositor/controller"
import {AnyEffect, VideoEffect} from "../../../types.js"
import {get_effects_at_timestamp} from "../utils/get_effects_at_timestamp.js"
import { demuxer } from "../../../../tools/mp4boxjs/demuxer.js"
import { Encoder } from "./encoder.js"

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
		number = 0
	constructor(private actions: Actions, private media: Media, private compositor: Compositor, private encoder: Encoder) {}

	async get_and_draw_decoded_frame(effects: AnyEffect[], timestamp: number) {
		const effects_at_timestamp = get_effects_at_timestamp(effects, timestamp)
		for(const effect of effects_at_timestamp) {
			if(effect.kind === "video") {
				const {frame, frame_id} = await this.#get_frame_from_video(effect, timestamp)
				this.compositor.managers.videoManager.draw_decoded_frame(effect, frame)
				frame.close()
				this.#remove_stale_chunks(timestamp)
				this.decoded_frames.delete(frame_id)
			}
		}
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

	async #extract_frames_from_video(effect: VideoEffect, timestamp: number) {
		this.actions.set_export_status("demuxing")
		const worker = new Worker(new URL("./decode_worker.js", import.meta.url), {type: "module"})
		worker.addEventListener("message", (msg) => {
			if(msg.data.action === "new-frame") {
				const id = generate_id()
				this.number += 1
				this.decoded_frames.set(id, {...msg.data.frame, frame_id: id})
			}
		})
		const file = await this.media.get_file(effect.file_hash)
		worker.postMessage({action: "demux", effect: {
			...effect,
		}, starting_timestamp: timestamp, timebase: this.compositor.timebase, frames: effect.frames})
		demuxer(
			file!,
			this.encoder.encode_worker,
			(config) => worker.postMessage({action: "configure", config}),
			(chunk) => {
						worker.postMessage({action: "chunk", chunk})
			}
		)
		this.decoded_effects.set(effect.id, effect.id)
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

	#remove_stale_chunks(thresholdTimestamp: number) {
		const entriesToRemove: string[] = []
		const timebase_in_ms = 1000/this.compositor.timebase

	/* margin to keep about one frame more incase its needed,
-		* for some reason sometimes its needed, but im lazy to fix it */
		const margin_for_additional_frame = timebase_in_ms * 1.5

 		this.decoded_frames.forEach((value, key) => {
			if (value.timestamp < thresholdTimestamp - margin_for_additional_frame) {
				entriesToRemove.push(key)
			}
		})

		entriesToRemove.forEach(key => {
				const decoded = this.decoded_frames.get(key)
				decoded?.frame.close()
				this.decoded_frames.delete(key)
		})
	}
}
