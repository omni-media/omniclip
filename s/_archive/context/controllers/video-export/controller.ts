import {pub} from "@benev/slate"

import {Actions} from "../../actions.js"
import {Decoder} from "./parts/decoder.js"
import {Encoder} from "./parts/encoder.js"
import {Media} from "../media/controller.js"
import {AnyEffect, State} from "../../types.js"
import {FPSCounter} from "./tools/FPSCounter/tool.js"
import {Compositor} from "../compositor/controller.js"
import {FileSystemHelper} from "./helpers/FileSystemHelper/helper.js"

export class VideoExport {
	#FileSystemHelper = new FileSystemHelper()

	on_timestamp_change = pub<number>()
	#timestamp = 0
	#timestamp_end = 0

	#FPSCounter: FPSCounter
	#Decoder: Decoder
	#Encoder: Encoder
	#exporting = false

	constructor(private actions: Actions, private compositor: Compositor, media: Media) {
		this.#FPSCounter = new FPSCounter(this.actions.set_fps, 100)
		this.#Encoder = new Encoder(actions, compositor, media)
		this.#Decoder = new Decoder(actions, media, compositor, this.#Encoder)
	}

	async save_file() {
		const handle = await this.#FileSystemHelper.getFileHandle()
		await this.#FileSystemHelper.writeFile(handle, this.#Encoder.file!)
	}

	resetExporter(state: State) {
		this.#exporting = false
		this.#timestamp = 0
		this.#timestamp_end = 0
		this.#Decoder.reset()
		this.#Encoder.reset()
		this.actions.set_is_exporting(false, {omit: true})
		this.actions.set_export_status("composing")
		this.compositor.reset()
		this.compositor.app.view.style.pointerEvents = "all"
		state.effects.forEach(effect => {
			if(effect.kind === "video") {
				this.compositor.managers.videoManager.reset(effect)
			}
		})
	}

	export_start(state: State, bitrate: number) {
		this.#exporting = true
		this.compositor.app.view.style.pointerEvents = "none"
		this.compositor.setOrDiscardActiveObjectOnCanvas(undefined, state)
		this.#Encoder.configure([state.settings.width, state.settings.height], bitrate, state.timebase)
		const sorted_effects = this.#sort_effects_by_track(state.effects)
		this.#timestamp_end = Math.max(...sorted_effects.map(effect => effect.start_at_position + (effect.end - effect.start)))
		this.#export_process(sorted_effects, state.timebase)
		this.actions.set_is_exporting(true, {omit: true})
		this.compositor.reset()
	}

	async #export_process(effects: AnyEffect[], timebase: number) {
		if(!this.#exporting) {return}
		await this.#Decoder.get_and_draw_decoded_frame(effects, this.#timestamp)
		this.compositor.compose_effects(effects, this.#timestamp, true)
		this.actions.set_export_status("composing")
		this.#Encoder.encode_composed_frame(this.compositor.app.view, this.#timestamp)
		this.#timestamp += 1000/this.compositor.timebase
		this.compositor.managers.animationManager.seek(this.#timestamp)
		this.compositor.managers.transitionManager.seek(this.#timestamp)
		this.on_timestamp_change.publish(this.#timestamp)
		const progress = this.#timestamp / this.#timestamp_end * 100 // for progress bar
		this.actions.set_export_progress(progress, {omit: true})

		if(Math.ceil(this.#timestamp) >= this.#timestamp_end) {
			this.#Encoder.export_process_end(effects, timebase)
			return
		}

		requestAnimationFrame(() => {
			this.#export_process(effects, timebase)
			this.#FPSCounter.update()
		})
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
