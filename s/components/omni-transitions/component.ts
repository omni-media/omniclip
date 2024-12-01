import {Op, html} from "@benev/slate"

import {styles} from "./styles.js"
import transitionSvg from "../../icons/transition.svg.js"
import {shadow_component} from "../../context/context.js"
import {StateHandler} from "../../views/state-handler/view.js"
import {ImageEffect, VideoEffect} from "../../context/types.js"
import {normalizeTransitionDuration} from "./utils/normalize-transition-duration.js"
import {calculateMaxTransitionDuration} from "./utils/calculate-max-transition-duration.js"
import {SelectedPair, transition} from "../../context/controllers/compositor/parts/transition-manager.js"

export const OmniTransitions = shadow_component(use => {
	use.styles(styles)
	use.watch(() => use.context.state)
	const [animationDuration, setAnimationDuration] = use.state(0.52)
	const manager = use.context.controllers.compositor.managers.transitionManager

	use.mount(() => {
		const dispose = manager.onChange(() => use.rerender())
		return () => dispose()
	})

	const selectedImageOrVideoEffect = use.context.state.selected_effect?.kind === "video" || use.context.state.selected_effect?.kind === "image"
		? use.context.state.effects.find(effect => effect.id === use.context.state.selected_effect!.id)! as ImageEffect | VideoEffect
		: null

	const renderTransitions = () => {
		return transition.map(transition => {
			const {incoming, outgoing} = manager.selected!
			return html`
				<div
					?data-selected=${manager.isSelected(transition)}
					?disabled=${!selectedImageOrVideoEffect}
					@click=${() => manager.selectTransition({
						incoming: incoming,
						outgoing: outgoing,
						duration: normalizeTransitionDuration(animationDuration * 1000, 1000 / use.context.state.timebase),
						animation: "fade"})
						.apply(use.context.state)
					}
					class="transition"
				>
					<span class="text">
						${transition}
					</span>
				</div>
			`
		})
	}

	const renderAnimationNone = () => {
		return html`
			<div
				?data-selected=${!manager.selected}
				?disabled=${!selectedImageOrVideoEffect}
				@click=${() => manager.removeSelectedTransistion(use.context.state)}
				class="transition"
			>
				<span class="text">
					none
				</span>
			</div>
	`}

	const renderDurationSlider = (pair: SelectedPair) => {
		const max = calculateMaxTransitionDuration(pair, use.context.state)
		const frameDuration = 1000 / use.context.state.timebase / 1000

		return html`
			<div class=duration-slider>
				<label for="duration">Duration:</label>
				<input
					@input=${(e: InputEvent) => setAnimationDuration(+(e.target as HTMLInputElement).value)}
					@change=${() => {
						manager.updateTransition(use.context.state, {duration: animationDuration, kind: "in"})
						manager.updateTransition(use.context.state, {duration: animationDuration, kind: "out"})
					}}
					type="range"
					min="0.5"
					max=${max}
					step=${frameDuration}
					value=${animationDuration}
					name="duration"
					id="duration"
				>
				<span>${animationDuration}s</span>
			</div>
		`
	}

	return StateHandler(Op.all(
		use.context.helpers.ffmpeg.is_loading.value,
		use.context.is_webcodecs_supported.value), () => html`
		<div class="transitions">
			<h2>${transitionSvg} Transitions</h2>
			${manager.selected
				? html`
					${renderDurationSlider(manager.selected)}
					<div class="transition-cnt" ?disabled=${!manager.selected}>
						${renderAnimationNone()}
						${renderTransitions()}
					</div>
				`
				: null}
		</div>
	`)
})
