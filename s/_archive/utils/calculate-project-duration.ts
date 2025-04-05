import {AnyEffect} from "../context/types"

export function calculateProjectDuration(effects: AnyEffect[]) {
	return Math.max(...effects.map(effect => effect.start_at_position + (effect.end - effect.start)))
}
