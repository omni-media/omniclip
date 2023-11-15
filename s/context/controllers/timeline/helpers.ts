import {XClip} from "./types.js"
import {Timeline} from "./types.js"

export class TimelineHelpers {
	constructor(private timeline: Timeline) {}

	get_clip(clip: XClip) {
		return this.timeline.clips.find(({id}) => id === clip.id)
	}

	get_clips() {
		return this.timeline.clips
	}
}
