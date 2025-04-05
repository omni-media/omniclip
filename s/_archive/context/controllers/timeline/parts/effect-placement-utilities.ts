import {AnyEffect} from "../../../types.js"

// EffectPlacementUtilities: Utility for calculations and sorting
export class EffectPlacementUtilities {
	getEffectsBefore(effects: AnyEffect[], timelineStart: number) {
		return effects.filter(effect => effect.start_at_position < timelineStart)
			.sort((a, b) => b.start_at_position - a.start_at_position)
	}

	getEffectsAfter(effects: AnyEffect[], timelineStart: number) {
		return effects.filter(effect => effect.start_at_position > timelineStart)
			.sort((a, b) => a.start_at_position - b.start_at_position)
	}

	calculateSpaceBetween(effectBefore: AnyEffect, effectAfter: AnyEffect) {
		return effectAfter.start_at_position - (effectBefore.start_at_position + (effectBefore.end - effectBefore.start))
	}

	calculateDistanceToAfter(effectAfter: AnyEffect, timelineEnd: number) {
		return effectAfter.start_at_position - timelineEnd
	}

	calculateDistanceToBefore(effectBefore: AnyEffect, timelineStart: number) {
		return timelineStart - (effectBefore.start_at_position + (effectBefore.end - effectBefore.start))
	}

	roundToNearestFrame(position: number, timebase: number) {
		return Math.round(position / (1000 / timebase)) * (1000 / timebase)
	}
}
