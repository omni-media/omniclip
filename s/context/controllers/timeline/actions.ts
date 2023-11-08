import {ZipAction} from "@benev/slate"

import {actionize} from "../../../main.js"
import {TrackItem} from "../../../components/omni-timeline/types.js"

export const timeline_actions = actionize({
	add_track_item: state => (item: TrackItem, track_index: number) =>  {
		state.timeline[track_index].push(item)
	},
	remove_track_item: state => (item_index: number, track_index: number) =>  {
		const removed = state.timeline[track_index].splice(item_index, 1)
		return removed[0]
	},
	add_track: state => () => {
			state.timeline.push([])
	},
	get_timeline_data: state => () => {
		return state.timeline
	}
})

export type TimelineActions = ZipAction.Callable<typeof timeline_actions>
