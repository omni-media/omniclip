
import {Id} from "@omnimedia/omnitool"
import {Ms} from "@omnimedia/omnitool/x/units/ms.js"

import {Idx} from "../index.js"
import {getBounds} from "../bounds.js"


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

export const wrapChild = (
	parent: Idx.Struct,
	targetId: Id,
	container: Idx.Struct,
) => ({
	...parent,
	childrenIds: replaceChild(parent.childrenIds, targetId, [container.id]),
})

export const wrapSiblings = (
	parent: Idx.Struct,
	targetId: Id,
	movingId: Id,
	container: Idx.Struct,
) => wrapChild({
	...parent,
	childrenIds: parent.childrenIds.filter(id => id !== movingId),
}, targetId, container)

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

