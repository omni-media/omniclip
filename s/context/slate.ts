import {Slate, ZipAction, watch} from "@benev/slate"
import {slate, Context} from "@benev/construct/x/mini.js"

import {OmniState} from "../types.js"
import {Timeline} from "./controllers/timeline/controller.js"
import {timeline_state} from "./controllers/timeline/state.js"
import {timeline_actions} from "./controllers/timeline/actions.js"

export class OmniContext extends Context {
	#state =  watch.stateTree<OmniState>({
		timeline: timeline_state
	})

	get state() {
		return this.#state.state
	}

	actions = ZipAction.actualize(this.#state, {
		timeline_actions
	})

	controllers = {
		timeline: new Timeline(this.actions.timeline_actions)
	}
}

export const omnislate = slate as Slate<OmniContext>
export const {shadow_component, shadow_view, light_view} = omnislate
