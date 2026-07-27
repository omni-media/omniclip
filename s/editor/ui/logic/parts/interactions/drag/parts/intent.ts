
import {Id, Item, Kind} from "@omnimedia/omnitool"

import {Idx} from "../../../index.js"
import {DragPoint, DragSnapshot} from "./snapshot.js"

export type DropIntent = {parentId: Id, index: number}

type GetDropIntentOpts = {
	snapshot: DragSnapshot
	movingId: Id
	point: DragPoint
}

export function getDropIntent({snapshot, movingId, point}: GetDropIntentOpts) {

	const insert = (parent: Item.Sequence | Item.Stack): DropIntent => ({
		parentId: parent.id,
		index: snapshot.getInsertIndex(parent, movingId, point),
	})

	const viewed = snapshot.index.getItem<Idx.Struct>(snapshot.viewedId)
	const target = snapshot.clipAt(point)

	if (!target || target.itemId === movingId)
		return insert(viewed)

	const item = snapshot.index.getItem(target.itemId)
	const insideSequence = point.x > target.x + 16 && point.x < target.x + target.width - 16

	return (item.kind === Kind.Stack || item.kind === Kind.Sequence && insideSequence)
		? insert(item)
		: insert(viewed)
}

