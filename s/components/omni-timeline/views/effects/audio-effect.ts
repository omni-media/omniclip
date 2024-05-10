import {html, watch, css, GoldElement} from "@benev/slate"

import {Effect} from "./parts/effect.js"
import {shadow_view} from "../../../../context/context.js"
import {AudioEffect as XAudioEffect} from "../../../../context/types.js"
import {Waveform} from "../../../../context/controllers/timeline/parts/waveform.js"

export const AudioEffect = shadow_view(use => (effect: XAudioEffect, timeline: GoldElement) => {
	const media_controller = use.context.controllers.media
	const [wave, setWave] = use.state<null | HTMLDivElement>(null)

	use.mount(() => {
		const wave = new Waveform(effect, use.context.controllers.media, use.context.state)
		setWave(wave.wave)
		const dispose = watch.track(() => use.context.state.zoom, (zoom) => wave!.update_waveform(use.context.state))
		media_controller.on_media_change(async ({files, action}) => {
			for(const {hash} of files) {
				if(hash === effect.file_hash && action === "added") {
					wave.on_file_found(use.context.state)
				}
			}
		})
		return () => {
			dispose()
			wave.dispose()
		}
	})

	return html`${Effect([timeline, effect, html`${wave}`])}`
})
