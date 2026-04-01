
import {Kind} from "@omnimedia/omnitool"
import {ms, Ms} from "@omnimedia/omnitool/x/units/ms.js"

import {Idx} from "../../../index.js"
import {getBounds} from "../../../bounds.js"

const MIN_CLIP_DURATION = 1

const availableHead = (clip: Idx.Clip, bounds: ReturnType<typeof getBounds>) =>
	clip.kind === Kind.Text
		? Number.NEGATIVE_INFINITY
		: -bounds.start

const availableTail = (clip: Idx.Clip, bounds: ReturnType<typeof getBounds>) =>
	clip.kind === Kind.Text
		? Number.POSITIVE_INFINITY
		: bounds.maxEnd - bounds.end

export function roll(
	left: Idx.Clip,
	right: Idx.Clip,
	delta: Ms,
	leftMediaDuration?: number,
	rightMediaDuration?: number,
) {
	const leftBounds = getBounds(left, leftMediaDuration)
	const rightBounds = getBounds(right, rightMediaDuration)

	const minDelta = ms(Math.max(
		MIN_CLIP_DURATION - left.duration,
		availableHead(right, rightBounds),
	))
	const maxDelta = ms(Math.min(
		availableTail(left, leftBounds),
		right.duration - MIN_CLIP_DURATION,
	))
	const clampedDelta = ms(Math.max(minDelta, Math.min(maxDelta, delta)))
	const rightStart = rightBounds.start + clampedDelta

	return {
		left: {...left, duration: left.duration + clampedDelta},
		right: {...right, start: rightStart, duration: rightBounds.end - rightStart},
	}
}

