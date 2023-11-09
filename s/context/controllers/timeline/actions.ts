import {generate_id, ZipAction} from "@benev/slate"
import {actionize} from "../../../main.js"
import {TimelineHelpers} from "./helpers.js"
import {Track, TrackItem} from "../../../components/omni-timeline/types.js"
export const timeline_actions = actionize({
	add_track_item: state => (item: TrackItem, {id}: Track) =>  {
		const helper = new TimelineHelpers(state.timeline)
		helper.get_track_items(id)?.push(item)
	},
	remove_track_item: state => (item: TrackItem, {id}: Track) =>  {
		const helper = new TimelineHelpers(state.timeline)
		const filtered = helper.get_track_items(id)?.filter(({id}) => id !== item.id)
		helper.get_track(id)!.track_items = filtered!
	},
	add_track: state => (item: TrackItem) => {
			state.timeline.push({id: generate_id(), track_items: [item]})
	},
	get_timeline_data: state => () => {
		return state.timeline
	}
})

export type TimelineActions = ZipAction.Callable<typeof timeline_actions>
