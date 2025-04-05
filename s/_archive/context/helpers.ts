import {HistoricalState} from "./types.js"

export class Helpers {
	constructor(private timeline: HistoricalState) {}

	get_effect(id: string) {
		return this.timeline.effects.find(effect => effect.id === id)
	}

	get_effects() {
		return this.timeline.effects
	}
}
