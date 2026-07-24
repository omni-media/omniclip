
import {Id, Item, Kind} from "@omnimedia/omnitool"
import {DragPoint, DragSnapshot} from "./snapshot.js"

export type DropIntent = {parentId: Id, index: number}

type GetDropIntentOpts = {
	snapshot: DragSnapshot
	movingId: Id
	point: DragPoint
}

export function getDropIntent({snapshot, movingId, point}: GetDropIntentOpts) {

	const into = (item: Item.Any): DropIntent | null => {
		if (item.kind === Kind.Sequence)
			return {parentId: item.id, index: snapshot.getInsertIndex(item, movingId, point)}
		if (item.kind === Kind.Stack)
			return {parentId: item.id, index: item.childrenIds.length}
		return null
	}

	const intoSequence = (viewed: Item.Sequence): DropIntent => {
		const target = viewed.childrenIds
			.filter(id => id !== movingId)
			.map(id => snapshot.getBox(id))
			.find(box => box && point.x > box.x + 16 && point.x < box.x + box.width - 16)
		const nested = target && into(snapshot.index.getItem(target.itemId))
		return nested ?? {parentId: viewed.id, index: snapshot.getInsertIndex(viewed, movingId, point)}
	}

	const intoStack = (viewed: Item.Stack): DropIntent => {
		const index = snapshot.getInsertIndex(viewed, movingId, point)
		const targetId = viewed.childrenIds[index]
		if (targetId == null || targetId === movingId)
			return {parentId: viewed.id, index}
		return into(snapshot.index.getItem(targetId)) ?? {parentId: viewed.id, index}
	}

	const viewed = snapshot.index.getItem(snapshot.viewedId)
	if (viewed.kind === Kind.Sequence)
		return intoSequence(viewed)
	if (viewed.kind === Kind.Stack)
		return intoStack(viewed)
	return null
}

