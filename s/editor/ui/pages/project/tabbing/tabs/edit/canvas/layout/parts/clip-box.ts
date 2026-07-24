
import {Id} from "@omnimedia/omnitool"

import {ClipBox} from "./types.js"
import type {TimelineCanvas} from "../../canvas.js"
import {Idx} from "../../../../../../../../logic/parts/index.js"
import {itemLabel} from "../../../../../../../../logic/utils/item-label.js"

export function makeClipBox(
	canvas: TimelineCanvas,
	{y, rootId, item}: {
		y: number
		rootId: Id
		item: Idx.AnyItem
	}): ClipBox {

  const duration = canvas.deps.session.index.getItemDuration(item.id)
  const time = canvas.deps.session.index.getItemLaneStart(item.id, rootId)

	const {width, height} = Idx.isStruct(item.kind)
		? canvas.structSize(item.kind, duration)
		: canvas.clipSize(duration)

	return {
		y,
		time,
		width,
		height,
		duration,
		itemId: item.id,
		kind: item.kind,
		label: itemLabel(item),
		x: canvas.viewport.timeToX(time)
	}
}

