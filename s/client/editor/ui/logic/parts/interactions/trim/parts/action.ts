
import {getBounds} from "../../../bounds.js"
import {Idx} from "../../../index.js"
import {TrimEdge} from "../trimmer.js"

const MIN_CLIP_DURATION = 1

export function trim(
	item: Idx.Clip,
	edge: TrimEdge,
	offset: number,
	mediaDuration?: number
): Idx.Clip {
	const {start, end, maxEnd} = getBounds(item, mediaDuration)

	if (edge === "start") {
		const nextStart = Math.max(0, Math.min(end - MIN_CLIP_DURATION, start + offset))
		return {...item, start: nextStart, duration: end - nextStart}
	}

	const nextEnd = Math.max(start + MIN_CLIP_DURATION, Math.min(maxEnd, start + offset))
	return {...item, start, duration: nextEnd - start}
}
