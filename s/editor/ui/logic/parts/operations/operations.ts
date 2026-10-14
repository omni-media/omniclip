
import {Id, Item, Ms, TimelineFile} from "@omnimedia/omnitool"

import {Idx, Index} from "../index.js"
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

export const copyClip = (
	clip: Idx.Clip,
	index: Index,
	getId: () => Id,
	id = getId(),
) => {
	const references: Item.Any[] = []
	const copyReference = (sourceId: Id) => {
		const copy = structuredClone(index.getItem(sourceId))
		copy.id = getId()
		references.push(copy)
		return copy.id
	}

	const copy = structuredClone(clip)
	copy.id = id
	if ("spatialId" in copy && copy.spatialId !== undefined)
		copy.spatialId = copyReference(copy.spatialId)
	if ("styleId" in copy && copy.styleId !== undefined)
		copy.styleId = copyReference(copy.styleId)
	if ("animationIds" in copy && copy.animationIds)
		copy.animationIds = copy.animationIds.map(copyReference)
	if ("filterIds" in copy && copy.filterIds)
		copy.filterIds = copy.filterIds.map(copyReference)

	return {copy, items: [...references, copy]}
}

export const ownedReferences = (item: Item.Any) => [
	...("spatialId" in item && item.spatialId !== undefined ? [item.spatialId] : []),
	...("styleId" in item && item.styleId !== undefined ? [item.styleId] : []),
	...("animationIds" in item ? item.animationIds ?? [] : []),
	...("filterIds" in item ? item.filterIds ?? [] : []),
]

export function removeTree(state: TimelineFile, rootId: Id) {
	const items = new Map(state.items.map(item => [item.id, item]))
	const removed = new Set<Id>()
	const references = new Set<Id>()
	const visit = (id: Id) => {
		const item = items.get(id)
		if (!item || removed.has(id)) return
		removed.add(id)
		for (const reference of ownedReferences(item))
			references.add(reference)
		if (Idx.isStruct(item))
			item.childrenIds.forEach(visit)
	}
	visit(rootId)

	// Keep referenced records still used by surviving items.
	for (const item of state.items)
		if (!removed.has(item.id))
			for (const reference of ownedReferences(item))
				references.delete(reference)

	state.items = state.items.filter(item => !removed.has(item.id) && !references.has(item.id))
}

