import {AnyEffect, State} from "../../../types.js"

export function getEffectsOnTrack(state: State, trackId: number): AnyEffect[] {
	return state.effects.filter(effect => effect.track === trackId)
}
