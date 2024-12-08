import {WatchTower} from "@benev/slate/x/watch/tower.js"
import {SignalTower} from "@benev/slate/x/signals/tower.js"
import {ZipAction} from "@benev/slate/x/watch/zip/action.js"

import {State} from "../../../types.js"
import {Timeline} from "../controller.js"
import {historical_state, non_historical_state} from "../../../state.js"
import {historical_actions, non_historical_actions} from "../../../actions.js"
import { Compositor } from "../../compositor/controller.js"
import { Media } from "../../media/controller.js"

const actions = {...non_historical_actions, ...historical_actions}
const state = {...historical_state, ...non_historical_state}

export function setup() {
	const signals = new SignalTower()
	const watch = new WatchTower(signals)
	const timelineTree = watch.stateTree<State>(state)
	const actions_timeline = ZipAction.actualize(timelineTree, actions)
	const media = new Media()
	return {
		timelineTree,
		timelineController: new Timeline(actions_timeline, media, new Compositor(actions_timeline))
	}
}
