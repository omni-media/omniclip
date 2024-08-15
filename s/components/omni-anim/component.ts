import {Op, html} from "@benev/slate"

import {styles} from "./styles.js"
import addSvg from "../../icons/gravity-ui/add.svg.js"
import {shadow_component} from "../../context/context.js"
import {StateHandler} from "../../views/state-handler/view.js"
import {ImageEffect, VideoEffect} from "../../context/types.js"
import {animationIn, animationOut} from "../../context/controllers/compositor/parts/animation-manager.js"

export const OmniAnim = shadow_component(use => {
	use.styles(styles)
	use.watch(() => use.context.state)
	const controllers = use.context.controllers
	const [kind, setKind] = use.state<"In" | "Out">("In")
	const manager = use.context.controllers.compositor.managers.animationManager

	const selectedImageOrVideoEffect = use.context.state.selected_effect?.kind === "video" || use.context.state.selected_effect?.kind === "image"
		? use.context.state.selected_effect
		: null

	const imageAndVideoEffects = () => use.context.state.effects.filter(effect => effect.kind === "image" || effect.kind === "video") as VideoEffect[] | ImageEffect[]

	const renderAnimationsIn = () => {
		return animationIn.map(animation => html`
			<div class="animation">
				<span style="color: #e66465; font-family: Lato;" class="text">
				${animation}
				</span>
				<button
					?disabled=${!selectedImageOrVideoEffect}
					@click=${() => manager.addAnimationToObject(selectedImageOrVideoEffect!, animation)}
					class="add-btn"
				>
					${addSvg}
				</button>
			</div>
		`)
	}

	const renderAnimationsOut = () => {
		return animationOut.map(animation => html`
			<div class="animation">
				<span style="color: #e66465; font-family: Lato;" class="text">
				${animation}
				</span>
				<button
					?disabled=${!selectedImageOrVideoEffect}
					@click=${() => manager.addAnimationToObject(selectedImageOrVideoEffect!, animation)}
					class="add-btn">
					${addSvg}
				</button>
			</div>
		`)
	}

	const renderEffectSelectionDropdown = () => {
		return html`
			<label for="clip"></label>
			<select
				@change=${(event: Event) => {
					const target = event.target as HTMLSelectElement
					const effectId = target.value
					const effect = use.context.state.effects.find(effect => effect.id === effectId)!
					controllers.timeline.set_selected_effect(effect, controllers.compositor, use.context.state)
				}}
				id="clip"
				name="clip"
			>
				<option value=none>none</option>
				${imageAndVideoEffects().map(effect => html`<option value=${effect.id}>${effect.name}</option>`)}
			</select>
		`
	}

	return StateHandler(Op.all(
		use.context.helpers.ffmpeg.is_loading.value,
		use.context.is_webcodecs_supported.value), () => html`
		<div class="animations">
			<div class="btn-cnt">
				<button @click=${() => setKind("In")}>In</button>
				<button @click=${() => setKind("Out")}>Out</button>
			</div>
			${renderEffectSelectionDropdown()}
			${selectedImageOrVideoEffect
				? html`<div>add animation for: ${selectedImageOrVideoEffect.name}</div>`
				: html`<div>select video or image either from dropdown menu here, timeline or scene</div>`
			}
			<div class="anim-cnt" ?disabled=${!selectedImageOrVideoEffect}>
				${kind === "In"
					? renderAnimationsIn()
					: renderAnimationsOut()
				}
			</div>
		</div>
	`)
})
