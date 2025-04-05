import {html, watch, GoldElement} from "@benev/slate"

import {Effect} from "./parts/effect.js"
import {shadow_view} from "../../../../context/context.js"
import {AudioEffect as XAudioEffect} from "../../../../context/types.js"
import {Waveform} from "../../../../context/controllers/timeline/parts/waveform.js"

export const AudioEffect = shadow_view(use => (effect: XAudioEffect, timeline: GoldElement) => {
	const media = use.context.controllers.media
	const compositor = use.context.controllers.compositor
	const [wave, setWave] = use.state<null | HTMLDivElement>(null)

	use.mount(() => {
		const wave = new Waveform(effect, use.context.controllers.media, use.context.state)
		setWave(wave.wave)
		const dispose = watch.track(() => use.context.state.zoom, (zoom) => wave!.update_waveform(use.context.state))
		const dispose1 = media.on_media_change(async ({files, action}) => {
			if(action === "added") {
				for(const {hash} of files) {
					const is_effect_already_composed = compositor.managers.audioManager.get(effect.id)
					if(hash === effect.file_hash && !is_effect_already_composed) {
						wave.on_file_found(use.context.state)
						compositor.recreate({...use.context.state, effects: [effect]}, media)
					}
				}
			}
		})
		return () => {
			dispose()
			dispose1()
			wave.dispose()
		}
	})

	return html`${Effect([timeline, effect, html`${wave}`])}`
})
