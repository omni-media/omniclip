import {Actions} from "../../actions.js"
import {Media} from "../media/controller.js"
import {Compositor} from "../compositor/controller.js"
import {EffectManager} from "./parts/effect-manager.js"
import {CanvasHandler} from "./parts/canvas-handler.js"
import {PlayheadDrag} from "./parts/drag-related/playhead-drag.js"
import {effectTrimHandler} from "./parts/drag-related/effect-trim.js"
import {EffectDragHandler} from "./parts/drag-related/effect-drag.js"
import {EffectPlacementProposal} from "./parts/effect-placement-proposal.js"
import {ProposedTimecode, AnyEffect, EffectTimecode, State} from "../../types.js"

// Timeline: Orchestrates the main actions and uses other classes for specific logic
export class Timeline {
	effectTrimHandler: effectTrimHandler
	effectDragHandler = new EffectDragHandler()
	playheadDragHandler = new PlayheadDrag()
	#placementProposal: EffectPlacementProposal
	#canvasHandler = new CanvasHandler()
	#effectManager: EffectManager

	constructor(private actions: Actions, media: Media, private compositor: Compositor) {
		this.effectTrimHandler = new effectTrimHandler(actions)
		this.#placementProposal = new EffectPlacementProposal()
		this.#effectManager = new EffectManager(actions, compositor, media)
	}

	calculate_proposed_timecode(effectTimecode: EffectTimecode, grabbed_effect_id: string, state: State) {
		return this.#placementProposal.calculateProposedTimecode(effectTimecode, grabbed_effect_id, state)
	}

	set_proposed_timecode(effect: AnyEffect, proposedTimecode: ProposedTimecode) {
		this.#effectManager.setProposedTimecode(effect, proposedTimecode)
	}

	remove_selected_effect(state: State) {
		if (state.selected_effect) {
			this.#effectManager.removeEffect(state.selected_effect)
		}
	}

	set_selected_effect(effect: AnyEffect | undefined, state: State) {
		this.#canvasHandler.setSelectedEffect(effect, this.compositor, state, this.actions)
	}

	setOrDiscardActiveObjectOnCanvas(effect: AnyEffect, state: State) {
		this.#canvasHandler.setOrDiscardActiveObjectOnCanvas(effect, this.compositor, state)
	}

	/**
		* Splits the selected effect or any effect at the current timestamp.
		* @param state - The current application state.
	*/
	split(state: State) {
		this.#effectManager.splitEffectAtTimestamp(state)
	}
}
