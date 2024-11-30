import {Op, html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_component} from "../../context/context.js"
import {StateHandler} from "../../views/state-handler/view.js"
import {AudioEffect, VideoEffect} from "../../context/types.js"

export const OmniAudio = shadow_component(use => {
	use.watch(() => use.context.state)
	use.styles(styles)
	const controllers = use.context.controllers
	const audioManager = controllers.compositor.managers.audioManager

	const selectedAudioOrVideoEffect = use.context.state.selected_effect?.kind === "video" || use.context.state.selected_effect?.kind === "audio"
		? use.context.state.effects.find(effect => effect.id === use.context.state.selected_effect!.id)! as AudioEffect | VideoEffect
		: null

//	use.mount(() => {
//		const dispose = audioManager.onChange(() => use.rerender())
//		return () => dispose()
//	})

	const audioAndVideoEffects = () => use.context.state.effects.filter(effect => effect.kind === "audio" || effect.kind === "video") as VideoEffect[] | AudioEffect[]
	const renderEffectSelectionDropdown = () => {
            return html`
                <label for="clipVolume"></label>
                <select
                    @change=${(event: Event) => {
                        const target = event.target as HTMLSelectElement;
                        const effectId = target.value;
                        const effect = use.context.state.effects.find(effect => effect.id === effectId);
                        controllers.timeline.set_selected_effect(effect, use.context.state);
                        if(selectedAudioOrVideoEffect){
                            let range = use.shadow.getElementById("rangeVolume") as HTMLInputElement
                            range.value = ''+selectedAudioOrVideoEffect
                        }
                    }}
                    id="clipVolume"
                    name="clipVolume"
                >
                    <option .selected=${!selectedAudioOrVideoEffect} value="none">none</option>
                    ${audioAndVideoEffects().map(effect => html`<option .selected=${selectedAudioOrVideoEffect?.id === effect.id} value=${effect.id}>${effect.name}</option>`)}
                </select>

                <div class="volume-intensity">
                    <span>Volume</span>
                    <input
                        @mouseup=${(v: MouseEvent) => {
                            let volume = parseFloat((v.target as HTMLInputElement).value);
                            const selectElement = use.shadow.getElementById("clipVolume") as HTMLSelectElement;
                            const effectId = selectElement.value;
                            const effect = use.context.state.effects.find(effect => effect.id === effectId) as AudioEffect | VideoEffect;
                            if (effect) {
                                if (effect.kind === 'audio') {
                                    controllers.compositor.managers.audioManager.set_volume(effect, volume);
                                }
                                if (effect.kind === 'video') {
                                    controllers.compositor.managers.videoManager.set_volume(effect, volume);
                                }
                            }
                        }}
                        type="range" min="0" max="1" value="1" step="0.01" class="slider" id="rangeVolume"
                    />

                </div>
            `;
        }


	return StateHandler(Op.all(
		use.context.is_webcodecs_supported.value,
		use.context.helpers.ffmpeg.is_loading.value), () => html`
		<div class=box>
			${renderEffectSelectionDropdown()}
			${selectedAudioOrVideoEffect
				? html`<div>add filter for: ${selectedAudioOrVideoEffect.name}</div>`
				: html`<div>select video or audio either from dropdown menu here, timeline or scene</div>`
			}
		</div>
	`)
})
