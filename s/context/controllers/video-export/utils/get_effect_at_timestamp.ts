import {AnyEffect} from "../../../types.js"

export function get_effect_at_timestamp(effect: AnyEffect, timestamp: number) {
	if(effect.start_at_position <= timestamp && timestamp <= effect.start_at_position + (effect.end - effect.start))
		return effect
}
