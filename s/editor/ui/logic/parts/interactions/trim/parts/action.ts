
import {getBounds} from "../../../bounds.js"
import {Idx} from "../../../index.js"
import {TrimEdge} from "../trimmer.js"

export function trim(
	item: Idx.Clip,
	edge: TrimEdge,
	offset: number,
	mediaDuration?: number
): Idx.Clip {
	const {start, end, maxEnd} = getBounds(item, mediaDuration)

	if (edge === "start") {
		const nextStart = Math.max(0, Math.min(end - 1, start + offset))
		return {...item, start: nextStart, duration: end - nextStart}
	}

	const nextEnd = Math.max(start + 1, Math.min(maxEnd, start + offset))
	return {...item, start, duration: nextEnd - start}
}
