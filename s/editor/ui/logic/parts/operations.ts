
import {Id, Item, Kind} from "@omnimedia/omnitool"
import {Ms} from "@omnimedia/omnitool/x/units/ms.js"

import {getBounds} from "./bounds.js"
import {Idx} from "./index.js"

export const spliceChildren = (
	childrenIds: Id[],
	childId: Id,
	index: number,
) => {
	const next = childrenIds.filter(id => id !== childId)
	next.splice(index, 0, childId)
	return next
}

export const replaceChild = (
	childrenIds: Id[],
	targetId: Id,
	replacementIds: Id[],
) => childrenIds.flatMap(id => id === targetId ? replacementIds : [id])

export const wrapChildInSequence = (
	parent: Item.Sequence | Item.Stack,
	targetId: Id,
	sequenceId: Id,
	sequenceChildrenIds: Id[],
	removedIds: Id[] = [],
) => ({
	parent: {
		...parent,
		childrenIds: replaceChild(
			parent.childrenIds.filter(id => !removedIds.includes(id)),
			targetId,
			[sequenceId],
		),
	},
	sequence: {
		id: sequenceId,
		kind: Kind.Sequence,
		childrenIds: sequenceChildrenIds,
	} as Item.Sequence,
})

export const splitClip = (
	clip: Idx.Clip,
	leftId: Id,
	rightId: Id,
	offset: Ms,
) => {
	const {start} = getBounds(clip)

	return {
		left: {...clip, id: leftId, start, duration: offset},
		right: {
			...clip,
			id: rightId,
			start: start + offset,
			duration: clip.duration - offset,
		},
	}
}

