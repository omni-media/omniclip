import {Op, html} from "@benev/slate"

import {styles} from "./styles.js"
import transitionSvg from "../../icons/transition.svg.js"
import {shadow_component} from "../../context/context.js"
import {StateHandler} from "../../views/state-handler/view.js"
import {ImageEffect, VideoEffect} from "../../context/types.js"
import circleInfoSvg from "../../icons/gravity-ui/circle-info.svg.js"
import circlePlaySvg from "../../icons/gravity-ui/circle-play.svg.js"
import circlePauseSvg from "../../icons/gravity-ui/circle-pause.svg.js"
import {normalizeTransitionDuration} from "./utils/normalize-transition-duration.js"
import {calculateMaxTransitionDuration} from "./utils/calculate-max-transition-duration.js"
import {SelectedPair, transition} from "../../context/controllers/compositor/parts/transition-manager.js"

export const OmniTransitions = shadow_component(use => {
	use.styles(styles)
	use.watch(() => use.context.state)
	const manager = use.context.controllers.compositor.managers.transitionManager
	const [isTutorialPlaying, setTutorialPlaying] = use.state(false)

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
			const selectedAnimation = use.context.state.animations.find(a => a.targetEffect.id === manager.selected?.incoming.id)
			const duration = selectedAnimation?.duration ?? 520

			return html`
				<div
					?data-selected=${manager.isSelected(transition)}
					?disabled=${!selectedImageOrVideoEffect}
					@click=${() => manager.selectTransition({
						incoming: incoming,
						outgoing: outgoing,
						duration: normalizeTransitionDuration(duration, 1000 / use.context.state.timebase),
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
				@click=${() => manager.removeSelectedTransition()}
				class="transition"
			>
				<span class="text">
					none
				</span>
			</div>
	`}

	const renderDurationSlider = (pair: SelectedPair) => {
		const max = calculateMaxTransitionDuration(pair, use.context.state)
		const frameDuration = 1000 / use.context.state.timebase
		const duration = manager.getTransitionDuration(pair.incoming).incoming * 2

		return html`
			<div class=duration-slider>
				<label for="duration">Duration:</label>
				<input
					@change=${(e: InputEvent) => manager.updateTransition(
						use.context.state,
						{duration: +(e.target as HTMLInputElement).value, effect: selectedImageOrVideoEffect!}
					)}
					type="range"
					min="500"
					max=${max}
					step=${frameDuration}
					.value=${duration}
					name="duration"
					id="duration"
				>
				<span>${duration / 1000}s</span>
			</div>
		`
	}
	
	const tutorialVideo = use.once(() => {
		const video = document.createElement("video")
		video.src = "/assets/transition-tutorial.mp4"
		video.loop = true
		return video
	})

	const renderTutorialVideo = () => {
		return html`
			<div class=tutorial>
				<h4>${circleInfoSvg} How to add transition</h4>
				${tutorialVideo}
				<button @click=${() => {
					if(tutorialVideo.paused) {
						setTutorialPlaying(true)
						tutorialVideo.play()
					} else {
						setTutorialPlaying(false)
						tutorialVideo.pause()
					}
				}}>${isTutorialPlaying ? circlePauseSvg : circlePlaySvg}</button>
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
				: renderTutorialVideo()}
		</div>
	`)
})
