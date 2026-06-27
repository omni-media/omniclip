
import {Kind} from "@omnimedia/omnitool"
import {Idx} from "./index.js"

export const getBounds = (
	item: Idx.Clip,
	mediaDuration?: number
) => {
	const start = "start" in item ? (item.start ?? 0) : 0
	const end = start + item.duration
	const unbounded = item.kind === Kind.Text || item.kind === Kind.Image

	return {
		start,
		end,
		maxEnd: unbounded ? Infinity : (mediaDuration ?? end)
	}
}

