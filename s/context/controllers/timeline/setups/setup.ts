import {ZipAction} from "@benev/slate/x/watch/zip/action.js"
import {WatchTower} from "@benev/slate/x/watch/watch_tower.js"

import {Timeline} from "../controller.js"
import {timeline_state} from "../state.js"
import {timeline_actions} from "../actions.js"
import {OmniState} from "../../../../types.js"

export function setup() {
	const watch = new WatchTower()
	const timelineTree = watch.stateTree<OmniState>({
		timeline: timeline_state
	})
	const actions = ZipAction.actualize(timelineTree, timeline_actions)
	return {
		timelineTree,
		timelineController: new Timeline(actions)
	}
}
