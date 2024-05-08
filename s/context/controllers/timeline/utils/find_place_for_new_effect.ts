import {AnyEffect, XTrack} from "../../../types.js"

// it kind of works like timeline proposals, but less sophisticated, no shrinking or pushing effects etc, just
// placing new effect after last effect on some of the tracks that is closest to the start of timeline
export function find_place_for_new_effect(effects: AnyEffect[], tracks: XTrack[]) {
	let closestPosition = null
	let track = 0
	for(let track_index = 0; track_index < tracks.length; track_index++) {
		const track_effects = effects.filter(effect => effect.track === track_index)
		const track_effect = track_effects[track_effects.length - 1]
		if(track_effect) {
			const new_closest_position = track_effect.start_at_position + track_effect.end
			if(closestPosition !== 0 && !closestPosition || new_closest_position < closestPosition) {
				closestPosition = new_closest_position
				track = track_effect.track
			}
		} 
		else {
			closestPosition = 0
			track = track_index
		}
	}
	return {position: closestPosition, track}
}
