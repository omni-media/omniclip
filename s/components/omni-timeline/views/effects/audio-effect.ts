import {html, watch, css} from "@benev/slate"

import {Effect} from "./parts/effect.js"
import {shadow_view} from "../../../../context/context.js"
import {AudioEffect as XAudioEffect} from "../../../../context/types.js"
import {Waveform} from "../../../../context/controllers/timeline/parts/waveform.js"

export const AudioEffect = shadow_view(use => (effect: XAudioEffect) => {

	const [wave, setWave] = use.state<null | HTMLDivElement>(null)

	use.mount(() => {
		const wave = new Waveform(effect, use.context.controllers.compositor, use.context.state)
		setWave(wave.wave)
		const dispose = watch.track(() => use.context.state.zoom, (zoom) => wave!.update_waveform(use.context.state))
		return () => {
			dispose()
			wave.dispose()
		}
	})

	return html`${Effect([effect, html`${wave}`])}`
})
