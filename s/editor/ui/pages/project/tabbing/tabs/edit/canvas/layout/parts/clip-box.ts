
import {ClipBox} from "./types.js"
import type {TimelineCanvas} from "../../canvas.js"
import {Idx} from "../../../../../../../../logic/parts/index.js"
import {itemLabel} from "../../../../../../../../logic/utils/item-label.js"

export function makeClipBox(
	{x, y, item, canvas}: {
		canvas: TimelineCanvas,
		x: number
		y: number
		item: Idx.AnyItem
	}): ClipBox {

	const root = canvas.getViewedItem()
	const duration = canvas.deps.session.index.getItemDuration(item.id)
	const start = canvas.deps.session.index.getItemLaneStart(item.id, root.id)

	const {width, height} = Idx.isStruct(item.kind)
		? canvas.structSize(item.kind, duration)
		: canvas.clipSize(duration)

	return {
		y,
		x,
		start,
		width,
		height,
		duration,
		itemId: item.id,
		kind: item.kind,
		label: itemLabel(item)
	}
}

