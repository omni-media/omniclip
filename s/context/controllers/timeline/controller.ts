import {TimelineActions} from "./actions.js"
import {Track, TrackItem} from "../../../components/omni-timeline/types.js"

export class Timeline {

	constructor(private timeline_actions: TimelineActions) {}

	drag_item_start(item: TrackItem, track: Track) {
		this.timeline_actions.remove_track_item(item, track)
		return item
	}

	drag_item_drop(item_to_add: TrackItem, track: Track) {
		this.timeline_actions.add_track_item(item_to_add, track)
	}

}

