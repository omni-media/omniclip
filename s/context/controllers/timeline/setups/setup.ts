import {WatchTower} from "@benev/slate/x/watch/tower.js"
import {SignalTower} from "@benev/slate/x/signals/tower.js"
import {ZipAction} from "@benev/slate/x/watch/zip/action.js"

import {Timeline} from "../controller.js"
import {timeline_state} from "../state.js"
import {timeline_actions} from "../actions.js"
import {OmniState} from "../../../../types.js"

export function setup() {
	const signals = new SignalTower()
	const watch = new WatchTower(signals)
	const timelineTree = watch.stateTree<OmniState>({
		timeline: timeline_state
	})
	const actions = ZipAction.actualize(timelineTree, timeline_actions)
	return {
		timelineTree,
		timelineController: new Timeline(actions)
	}
}
