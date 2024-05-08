import {AnyEffect} from "../../../types.js"

export function sort_effects_by_track(effects: AnyEffect[]) {
	// so that effects on first track draw on top of things that are on second track
	const sorted_effects = effects.sort((a, b) => {
		if(a.track < b.track) return 1
			else return -1
	})
	return sorted_effects
}
