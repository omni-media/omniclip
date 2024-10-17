import {Op, html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_component} from "../../context/context.js"
import {StateHandler} from "../../views/state-handler/view.js"
import {ImageEffect, VideoEffect} from "../../context/types.js"
import {animationIn, animationNone, animationOut} from "../../context/controllers/compositor/parts/animation-manager.js"

export const OmniAnim = shadow_component(use => {
	use.styles(styles)
	use.watch(() => use.context.state)
	const controllers = use.context.controllers
	const [kind, setKind] = use.state<"In" | "Out">("In")
	const manager = use.context.controllers.compositor.managers.animationManager

	const selectedImageOrVideoEffect = use.context.state.selected_effect?.kind === "video" || use.context.state.selected_effect?.kind === "image"
		? use.context.state.effects.find(effect => effect.id === use.context.state.selected_effect!.id)! as ImageEffect | VideoEffect
		: null

	use.mount(() => {
		const dispose = manager.onChange(() => use.rerender())
		return () => dispose()
	})

	const imageAndVideoEffects = () => use.context.state.effects.filter(effect => effect.kind === "image" || effect.kind === "video") as VideoEffect[] | ImageEffect[]

	const renderAnimationsIn = () => {
		return animationIn.map(animation => {
			const anim = {type: animation, targetEffect: selectedImageOrVideoEffect!}
			return html`
				<div
					?data-selected=${manager.selectedAnimationForEffect(selectedImageOrVideoEffect, anim)}
					?disabled=${!selectedImageOrVideoEffect}
					@click=${() => manager.selectAnimation(selectedImageOrVideoEffect!, anim, use.context.state)}
					class="animation"
				>
					<span style="color: #e66465; font-family: Lato;" class="text">
						${animation}
					</span>
				</div>
		`})
	}

	const renderAnimationsOut = () => {
		return animationOut.map(animation => {
			const anim = {type: animation, targetEffect: selectedImageOrVideoEffect!}
			return html`
				<div
					?data-selected=${manager.selectedAnimationForEffect(selectedImageOrVideoEffect, anim)}
					?disabled=${!selectedImageOrVideoEffect}
					@click=${() => manager.selectAnimation(selectedImageOrVideoEffect!, anim, use.context.state)}
					class="animation"
				>
					<span style="color: #e66465; font-family: Lato;" class="text">
						${animation}
					</span>
				</div>
		`})
	}

	const renderAnimationNone = (type: "In" | "Out") => {
			return html`
				<div
					?data-selected=${type === "In" ? !manager.isAnyAnimationInSelected(selectedImageOrVideoEffect) : !manager.isAnyAnimationOutSelected(selectedImageOrVideoEffect)}
					?disabled=${!selectedImageOrVideoEffect}
					@click=${() => manager.deselectAnimation(selectedImageOrVideoEffect!, use.context.state, type)}
					class="animation"
				>
					<span style="color: #e66465; font-family: Lato;" class="text">
						${animationNone}
					</span>
				</div>
		`}

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
				<option .selected=${!selectedImageOrVideoEffect} value=none>none</option>
				${imageAndVideoEffects().map(effect => html`<option .selected=${selectedImageOrVideoEffect?.id === effect.id} value=${effect.id}>${effect.name}</option>`)}
			</select>
		`
	}

	return StateHandler(Op.all(
		use.context.helpers.ffmpeg.is_loading.value,
		use.context.is_webcodecs_supported.value), () => html`
		<div class="animations">
			<div class="btn-cnt">
				<button ?data-selected=${kind === "In"} @click=${() => setKind("In")}>In</button>
				<button ?data-selected=${kind === "Out"} @click=${() => setKind("Out")}>Out</button>
			</div>
			${renderEffectSelectionDropdown()}
			${selectedImageOrVideoEffect
				? html`<div>add animation for: ${selectedImageOrVideoEffect.name}</div>`
				: html`<div>select video or image either from dropdown menu here, timeline or scene</div>`
			}
			<div class="anim-cnt" ?disabled=${!selectedImageOrVideoEffect}>
				${renderAnimationNone(kind)}
				${kind === "In"
					? renderAnimationsIn()
					: renderAnimationsOut()
				}
			</div>
		</div>
	`)
})
