
import {Id, Item, Kind} from "@omnimedia/omnitool"

import {TrimEdge} from "../trimmer.js"

type ClipItem = Item.Video | Item.Audio | Item.Text

type OverlayFromTrimOpts = {
	clipId: Id
	edge: TrimEdge
	item: ClipItem
	duration: number
	offset: number
}

export function overlayFromTrim({clipId, edge, item, duration, offset}: OverlayFromTrimOpts) {
	const patched: Item.Any = edge === "end"
		? {...item, duration} as Item.Any
		: {
			...item,
			duration,
			...(item.kind !== Kind.Text && {start: item.start + offset}),
		} as Item.Any

	return new Map<Id, Item.Any>([[clipId, patched]])
}

