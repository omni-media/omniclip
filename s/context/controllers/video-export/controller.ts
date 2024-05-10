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

	#timestamp = 0
	#timestamp_end = 0

	#FPSCounter: FPSCounter
	#Decoder: Decoder
	#Encoder: Encoder

	constructor(private actions: Actions, private compositor: Compositor, media: Media) {
		this.#FPSCounter = new FPSCounter(this.actions.set_fps, 100)
		this.#Decoder = new Decoder(actions, media, compositor)
		this.#Encoder = new Encoder(actions, compositor, media)
	}

	async save_file() {
		const handle = await this.#FileSystemHelper.getFileHandle()
		await this.#FileSystemHelper.writeFile(handle, this.#Encoder.file!)
	}

	export_start(state: State, resolution: number[], bitrate: number) {
		this.#Encoder.configure(resolution, bitrate)
		const sorted_effects = this.#sort_effects_by_track(state.effects)
		this.#timestamp_end = Math.max(...sorted_effects.map(effect => effect.start_at_position - effect.start + effect.end))
		this.#export_process(sorted_effects)
		this.actions.set_is_exporting(true)
		this.compositor.currently_played_effects.clear()
		this.compositor.canvas.clear()
	}

	async #export_process(effects: AnyEffect[]) {
		await this.#Decoder.get_and_draw_decoded_frame(effects, this.#timestamp)
		this.compositor.compose_effects(effects, this.#timestamp, true)
		this.actions.set_export_status("composing")
		await this.#Encoder.encode_composed_frame(this.compositor.canvas.lowerCanvasEl, this.#timestamp)
		this.#timestamp += 1000/this.compositor.timebase
		const progress = this.#timestamp / this.#timestamp_end * 100 // for progress bar
		this.actions.set_export_progress(progress)

		if(Math.ceil(this.#timestamp) >= this.#timestamp_end) {
			this.#Encoder.export_process_end(effects)
			return
		}

		requestAnimationFrame(() => {
			this.#export_process(effects)
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
