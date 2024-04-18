import {WatchTower} from "@benev/slate/x/watch/tower.js"
import {SignalTower} from "@benev/slate/x/signals/tower.js"
import {ZipAction} from "@benev/slate/x/watch/zip/action.js"

import {Timeline} from "../controller.js"
import {timeline_historical_state, timeline_non_historical_state} from "../state.js"
import {timeline_historical_actions, timeline_non_historical_actions} from "../actions.js"
import {OmniState} from "../../../../types.js"

const actions = {...timeline_non_historical_actions, ...timeline_historical_actions}
const state = {...timeline_historical_state, ...timeline_non_historical_state}

export function setup() {
	const signals = new SignalTower()
	const watch = new WatchTower(signals)
	const timelineTree = watch.stateTree<OmniState>({
		timeline: state
	})
	const actions_timeline = ZipAction.actualize(timelineTree, actions)
	return {
		timelineTree,
		timelineController: new Timeline(actions_timeline)
	}
}
