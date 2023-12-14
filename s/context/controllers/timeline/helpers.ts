import {XTimeline} from "./types.js"

export class TimelineHelpers {
	constructor(private timeline: XTimeline) {}

	get_clip(id: string) {
		return this.timeline.clips.find(clip => clip.id === id)
	}

	get_clips() {
		return this.timeline.clips
	}
}
