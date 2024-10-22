import {Op, html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_component} from "../../context/context.js"
import {StateHandler} from "../../views/state-handler/view.js"
import {ImageEffect, TextEffect, VideoEffect} from "../../context/types.js"
import {animationIn, animationNone, animationOut, textAnimationIn} from "../../context/controllers/compositor/parts/animation-manager.js"

export const OmniAnim = shadow_component(use => {
	use.styles(styles)
	use.watch(() => use.context.state)
	const controllers = use.context.controllers
	const [kind, setKind] = use.state<"In" | "Out">("In")
	const manager = use.context.controllers.compositor.managers.animationManager

	const selectedAnimatableEffect = use.context.state.selected_effect && use.context.state.selected_effect.kind !== "audio"
		? use.context.state.effects.find(effect => effect.id === use.context.state.selected_effect?.id)! as ImageEffect | VideoEffect | TextEffect
		: null

	use.mount(() => {
		const dispose = manager.onChange(() => use.rerender())
		return () => dispose()
	})

	const ImageTextVideoEffects = () => use.context.state.effects.filter(effect => effect.kind === "image" || effect.kind === "video" || effect.kind === "text") as VideoEffect[] | ImageEffect[] | TextEffect[]

	const renderAnimationsIn = () => {
		return animationIn.map(animation => {
			const anim = {type: animation, targetEffect: selectedAnimatableEffect!}
			return html`
				<div
					?data-selected=${manager.selectedAnimationForEffect(selectedAnimatableEffect, anim)}
					?disabled=${!selectedAnimatableEffect}
					@click=${() => manager.selectAnimation(selectedAnimatableEffect!, anim, use.context.state)}
					class="animation"
				>
					<span style="color: #e66465; font-family: Lato;" class="text">
						${animation}
					</span>
				</div>
		`})
	}

	const renderTextAnimationsIn = () => {
		return textAnimationIn.map(animation => {
			const anim = {type: animation, targetEffect: selectedAnimatableEffect!}
			return html`
				<div
					?data-selected=${manager.selectedAnimationForEffect(selectedAnimatableEffect, anim)}
					?disabled=${!selectedAnimatableEffect}
					@click=${() => manager.selectAnimation(selectedAnimatableEffect!, anim, use.context.state)}
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
			const anim = {type: animation, targetEffect: selectedAnimatableEffect!}
			return html`
				<div
					?data-selected=${manager.selectedAnimationForEffect(selectedAnimatableEffect, anim)}
					?disabled=${!selectedAnimatableEffect}
					@click=${() => manager.selectAnimation(selectedAnimatableEffect!, anim, use.context.state)}
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
					?data-selected=${type === "In" ? !manager.isAnyAnimationInSelected(selectedAnimatableEffect) : !manager.isAnyAnimationOutSelected(selectedAnimatableEffect)}
					?disabled=${!selectedAnimatableEffect}
					@click=${() => manager.deselectAnimation(selectedAnimatableEffect!, use.context.state, type)}
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
				<option .selected=${!selectedAnimatableEffect} value=none>none</option>
				${ImageTextVideoEffects().map((effect, i) => html`
					<option
						.selected=${selectedAnimatableEffect?.id === effect.id}
						value=${effect.id}
					>
						${effect.kind !== "text" ? effect.name : `text-${i}`}
					</option>
				`)}
			</select>
		`
	}

	const renderImageAndVideoAnimations = () => {
		return kind === "In"
			? renderAnimationsIn()
			: renderAnimationsOut()
	}

	const renderTextAnimations = () => {
		return kind === "In"
			? renderTextAnimationsIn()
			: "out"
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
			${selectedAnimatableEffect
				? html`<div>add animation for: ${selectedAnimatableEffect.kind !== "text" ? selectedAnimatableEffect.name : selectedAnimatableEffect.content}</div>`
				: html`<div>select video, text or image either from dropdown menu here, timeline or scene</div>`
			}
			<div class="anim-cnt" ?disabled=${!selectedAnimatableEffect}>
				${renderAnimationNone(kind)}
				${selectedAnimatableEffect?.kind === "text"
					? renderTextAnimations()
					: renderImageAndVideoAnimations()
				}
			</div>
		</div>
	`)
})
