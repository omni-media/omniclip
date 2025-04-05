import {AnyEffect} from "../../../types.js"
import {omnislate} from "../../../context.js"

export function isEffectMuted(effect: AnyEffect) {
	const track = omnislate.context.state.tracks[effect.track]
	return track?.muted ?? false
}
