import {Id, Kind, ms, Ms} from "@omnimedia/omnitool"

import {Idx, Index} from "../index.js"
import {splitClip} from "../operations/operations.js"

export function* withRange(index: Index, items: Idx.AnyItem[]) {
	let cursor = ms(0)
	for (let i = 0; i < items.length; i++) {
		const end = ms(cursor + itemDuration(index, items[i]))
		yield {item: items[i], i, start: cursor, end}
		cursor = end
	}
}

export function splitItem(item: Idx.AnyItem, at: Ms, getId: () => Id) {
	if (item.kind === Kind.Gap)
		return {
			left: {...item, duration: at},
			right: {...item, id: getId(), duration: ms(item.duration - at)},
		}
	if (!Idx.isClip(item.kind))
		return null
	return splitClip(item as Idx.Clip, item.id, getId(), at)
}

export const itemDuration = (index: Index, item: Idx.AnyItem): Ms =>
	"duration" in item ? ms(item.duration) : index.getItemDuration(item.id)
