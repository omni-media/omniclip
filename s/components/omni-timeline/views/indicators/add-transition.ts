import {html} from "@benev/slate"

import {light_view} from "../../../../context/context.js"
import transitionSvg from "../../../../icons/transition.svg.js"
import {calculate_start_position} from "../../utils/calculate_start_position.js"
import {calculate_effect_track_placement} from "../../utils/calculate_effect_track_placement.js"
import {TransitionAbleEffect} from "../../../../context/controllers/compositor/parts/transition-manager.js"
import {normalizeTransitionDuration} from "../../../omni-transitions/utils/normalize-transition-duration.js"

export const TransitionIndicator = light_view(use => () => {
	const state = use.context.state
	const transitionManager = use.context.controllers.compositor.managers.transitionManager
	const touchingPairs = transitionManager.findTouchingClips(state.effects)

	use.mount(() => {
		const dispose = transitionManager.onChange(() => use.rerender())
		return () => dispose()
	})

	const renderAnimationDurationIndicators = (pair: {outgoing: TransitionAbleEffect, incoming: TransitionAbleEffect}) => {
		return Object.values(pair).map(effect => {
			const {incoming, outgoing} = transitionManager.getTransitionDuration(effect)
			return html`
				<div
					class="transition-duration"
					style="
						height: 50px;
						width: ${incoming ? incoming * Math.pow(2, state.zoom) : outgoing * Math.pow(2, state.zoom)}px;
					"
				>
				</div>
			`
		})
	}

	return html`
		${touchingPairs.map(({outgoing, incoming, position}) => {
			const selected = transitionManager.selected
			const isTransition = transitionManager.getTransition(incoming) && transitionManager.getTransition(outgoing)
			const isSelected = outgoing.id === selected?.outgoing.id && incoming.id === selected?.incoming.id

			return html`
				<div
					@click=${() => transitionManager
						.selectTransition({incoming, outgoing, duration: normalizeTransitionDuration(520, 1000 / state.timebase), animation: "fade"})
						.apply(use.context.state)}
					?data-transition=${isTransition}
					?data-selected=${isSelected}
					class="transition-indicator"
					style="
						transform: translate(
							${calculate_start_position(position, state.zoom)}px,
							${calculate_effect_track_placement(incoming.track, state.effects)}px
						);
					"
				>
					${isTransition ? transitionSvg : "+"}
					${isSelected ? renderAnimationDurationIndicators({outgoing, incoming}) : null}
				</div>
	`})}
	`
})
