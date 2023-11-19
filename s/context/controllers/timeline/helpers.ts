import {Timeline} from "./types.js"

export class TimelineHelpers {
	constructor(private timeline: Timeline) {}

	get_clip(id: string) {
		return this.timeline.clips.find(clip => clip.id === id)
	}

	get_clips() {
		return this.timeline.clips
	}
}
