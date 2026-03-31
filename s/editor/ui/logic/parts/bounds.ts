
import {Kind} from "@omnimedia/omnitool"
import {Idx} from "./index.js"

export const getBounds = (
	item: Idx.Clip,
	mediaDuration?: number
) => {
	const start = item.kind === Kind.Text ? (item.start ?? 0) : item.start
	const end = start + item.duration
	return {
		start,
		end,
		maxEnd: item.kind === Kind.Text ? Infinity : (mediaDuration ?? end)
	}
}

