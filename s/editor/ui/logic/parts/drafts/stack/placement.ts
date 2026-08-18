import {Id, Item, Kind} from "@omnimedia/omnitool"
import {Ms} from "@omnimedia/omnitool/x/units/ms.js"

import {Index} from "../../index.js"
import {replaceChild} from "../../operations/operations.js"
import type {Overlay} from "../../proposal/proposal.js"

export function place(stack: Item.Stack, movingId: Id, at: Ms, getId: () => Id): Overlay {
	if (at <= 0)
		return new Map()

	const gap: Item.Gap = {id: getId(), kind: Kind.Gap, duration: at}
	const lane: Item.Sequence = {id: getId(), kind: Kind.Sequence, childrenIds: [gap.id, movingId]}
	return new Map<Id, Item.Any | null>([
		[stack.id, {...stack, childrenIds: replaceChild(stack.childrenIds, movingId, [lane.id])}],
		[gap.id, gap],
		[lane.id, lane],
	])
}

export function positionLane(index: Index, itemId: Id) {
	const sequence = index.getParent(itemId)
	const stack = sequence && index.getParent(sequence.id)
	return sequence?.kind === Kind.Sequence && stack?.kind === Kind.Stack &&
		sequence.childrenIds.every(id => id === itemId || index.getItem(id).kind === Kind.Gap)
		? sequence
		: null
}
