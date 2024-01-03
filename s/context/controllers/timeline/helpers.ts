import {XTimeline} from "./types.js"

export class TimelineHelpers {
	constructor(private timeline: XTimeline) {}

	get_effect(id: string) {
		return this.timeline.effects.find(effect => effect.id === id)
	}

	get_effects() {
		return this.timeline.effects
	}
}
