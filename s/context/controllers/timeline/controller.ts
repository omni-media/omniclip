import { Media } from "../../../types";
import { TimelineActions } from "./actions";

export class Timeline {

	constructor(private timeline_actions: TimelineActions) {}
	
	drag_item_start(item: Media | Text, item_index: number, track_index: number) {}
	drag_item_drop() {}
}

