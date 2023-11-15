import {shock_drag_and_drop} from "@benev/construct"
import { pub } from "@benev/slate"

import {At, XClip} from "./types.js"
import {TimelineActions} from "./actions.js"

export class Timeline {
	drag = shock_drag_and_drop<XClip, At> ({handle_drop: (_event: DragEvent, grabbed, dropped_at) => {
		this.set_clip_track(grabbed, dropped_at)
		if(dropped_at.indicator) {
			this.timeline_actions.add_track()
		}
		this.on_drop.publish({clip: grabbed, dropped_at})
	}})

	on_drop = pub<{clip: XClip, dropped_at: At}>()
	
	constructor(private timeline_actions: TimelineActions) {}

	set_clip_track(clip: XClip, dropped_at: At) {
		const [_x, y] = dropped_at.coordinates
		const track_index = Math.floor(y / 40)
		if(track_index !== clip.track) {
			this.timeline_actions.set_clip_track(clip, track_index)
		}
	}

}

