import {generate_id, html} from "@benev/slate"

import {light_view} from "../../../../context/context.js"
import transitionSvg from "../../../../icons/transition.svg.js"
import {calculate_start_position} from "../../utils/calculate_start_position.js"
import {calculate_effect_track_placement} from "../../utils/calculate_effect_track_placement.js"
import {normalizeTransitionDuration} from "../../../omni-transitions/utils/normalize-transition-duration.js"

export const TransitionIndicator = light_view(use => () => {
	use.watch(() => use.context.state)
	const state = use.context.state
	const transitionManager = use.context.controllers.compositor.managers.transitionManager
	const touchingPairs = transitionManager.findTouchingClips(state.effects)

	use.mount(() => {
		const dispose = transitionManager.onChange(() => use.rerender())
		return () => dispose()
	})

	const renderAnimationDurationIndicators = (duration: number) => {
		return Object.values([0, 1]).map(_ => {
			return html`
				<div
					class="transition-duration"
					style="
						height: 50px;
						width: ${duration / 2 * Math.pow(2, state.zoom)}px;
					"
				>
				</div>
			`
		})
	}

	return html`
		${touchingPairs.map(({outgoing, incoming, position}) => {
			const transition = transitionManager.getTransitionByPair(outgoing, incoming)
			const isSelected = transition?.id === transitionManager.selected
			const transitionDuration = transition?.duration ?? 520

			return html`
				<div
					@click=${() => transitionManager
						.selectTransition({
							incoming,
							outgoing,
							duration: normalizeTransitionDuration(transitionDuration, 1000 / state.timebase),
							transition: transition?.transition ?? window.GLTransitions[1],
							id: transition?.id ?? generate_id()
						})?.apply(use.context.state)
					}
					?data-transition=${transition}
					?data-selected=${isSelected}
					class="transition-indicator"
					style="
						transform: translate(
							${calculate_start_position(position, state.zoom)}px,
							${calculate_effect_track_placement(incoming.track, state.effects)}px
						);
					"
				>
					${transition ? transitionSvg : "+"}
					${isSelected ? renderAnimationDurationIndicators(transitionDuration) : null}
				</div>
	`})}
	`
})
