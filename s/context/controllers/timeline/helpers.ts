import {TimelineState} from "../../../types.js"

export class TimelineHelpers {
	constructor(private timeline_state: TimelineState) {}

	get_track(track_id: string) {
		return this.timeline_state.find(track => track.id === track_id)
	}

	get_track_items(track_id: string) {
		return this.get_track(track_id)?.track_items
	}
}
