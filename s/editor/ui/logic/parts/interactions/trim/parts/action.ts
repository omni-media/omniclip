
import {applyBounds, getBounds, TimelineClip} from "../../../bounds.js"
import {TrimEdge} from "../trimmer.js"

export function trim(
	item: TimelineClip,
	edge: TrimEdge,
	offset: number,
	mediaDuration?: number
): TimelineClip {
	const {start, end, maxEnd} = getBounds(item, mediaDuration)

	if (edge === "start") {
		const nextStart = Math.max(0, Math.min(end - 1, start + offset))
		return applyBounds(item, nextStart, end - nextStart)
	}

	const nextEnd = Math.max(start + 1, Math.min(maxEnd, start + offset))
	return applyBounds(item, start, nextEnd - start)
}
