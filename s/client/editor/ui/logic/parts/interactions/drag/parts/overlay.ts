
import {Id, Item, Kind} from "@omnimedia/omnitool"

import type {DropIntent} from "./intent.js"
import {Idx, Index} from "../../../index.js"
import {replaceChild, spliceChildren, wrapSiblings} from "../../../operations/operations.js"

type OverlayFromDropIntentOpts = {
	index: Index
	movingId: Id
	newContainerId: Id
	drop: DropIntent
}

type Overlay = Map<Id, Item.Any | null>

/*Translates intent into tree changes*/

export function overlayFromDropIntent({index, movingId, newContainerId, drop}: OverlayFromDropIntentOpts) {
	const sourceParent = index.getParent(movingId)
	const destination = dropDestination(index, drop)
	if (!sourceParent || !destination)
		return null

	const insertBefore = drop.edge === "left" || drop.edge === "top"
	const {targetParent, container, kind} = destination

	const overlay = container
		? moveIntoContainer({sourceParent, container, movingId, drop, insertBefore})
		: wrapIntoNewContainer({targetParent, movingId, newContainerId, drop, insertBefore, kind})

	if (!overlay)
		return null

	if (!overlay.has(sourceParent.id))
		overlay.set(sourceParent.id, withoutChild(sourceParent, movingId))

	return collapseRedundantAncestors(index, overlay, sourceParent.id)
}

function moveIntoContainer(opts: {
	sourceParent: Idx.Struct
	container: Idx.Struct
	movingId: Id
	drop: DropIntent
	insertBefore: boolean
}): Overlay | null {
	const {sourceParent, container, movingId, drop, insertBefore} = opts

	const position = insertionIndex(container, movingId, drop.targetId, insertBefore)
	const childrenIds = spliceChildren(container.childrenIds, movingId, position)

	const isNoopDrop = sourceParent.id === container.id && sameOrder(container.childrenIds, childrenIds)
	if (isNoopDrop)
		return null

	return new Map([[container.id, {...container, childrenIds}]])
}

export function dropDestination(index: Index, drop: DropIntent) {
	const targetParent = index.getParent(drop.targetId)
	if (!targetParent) return null
	const target = index.getItem(drop.targetId)
	const kind: Kind.Sequence | Kind.Stack = drop.edge === "left" || drop.edge === "right" ? Kind.Sequence : Kind.Stack
	const container = existingContainer(target, targetParent, kind)
	return {targetParent, container, kind}
}

function existingContainer(
	target: Idx.AnyItem,
	parent: Idx.Struct,
	kind: Kind.Sequence | Kind.Stack,
): Idx.Struct | null {
	if (Idx.isStruct(target) && target.kind === kind)
		return target
	if (parent.kind === kind)
		return parent
	return null
}

function insertionIndex(container: Idx.Struct, movingId: Id, targetId: Id, before: boolean) {
	const siblings = container.childrenIds.filter(id => id !== movingId)
	const targetIndex = siblings.indexOf(targetId)
	if (targetIndex >= 0)
		return targetIndex + (before ? 0 : 1)
	return before ? 0 : siblings.length
}

function wrapIntoNewContainer(opts: {
	targetParent: Idx.Struct
	movingId: Id
	newContainerId: Id
	drop: DropIntent
	insertBefore: boolean
	kind: Kind.Sequence | Kind.Stack
}): Overlay {
	const {targetParent, movingId, newContainerId, drop, insertBefore, kind} = opts

	const childrenIds = insertBefore ? [movingId, drop.targetId] : [drop.targetId, movingId]
	const newContainer: Idx.Struct = {id: newContainerId, kind, childrenIds}

	return new Map([
		[targetParent.id, wrapSiblings(targetParent, drop.targetId, movingId, newContainer)],
		[newContainer.id, newContainer],
	])
}

function withoutChild(item: Idx.Struct, childId: Id): Idx.Struct {
	return {...item, childrenIds: item.childrenIds.filter(id => id !== childId)}
}

function sameOrder(before: readonly Id[], after: readonly Id[]): boolean {
	return before.length === after.length && before.every((id, i) => id === after[i])
}

function collapseRedundantAncestors(index: Index, overlay: Overlay, id: Id): Overlay {
	const item = overlay.has(id) ? overlay.get(id) : index.getItemMaybe(id)
	const parent = currentParent(index, overlay, id)
	if (!item || !Idx.isStruct(item) || item.childrenIds.length > 1 || !parent)
		return overlay

	overlay.set(id, null)
	overlay.set(parent.id, {
		...parent,
		childrenIds: replaceChild(parent.childrenIds, id, item.childrenIds),
	})

	return collapseRedundantAncestors(index, overlay, parent.id)
}

function currentParent(index: Index, overlay: Overlay, childId: Id) {
	for (const item of overlay.values())
		if (item && Idx.isStruct(item) && item.childrenIds.includes(childId))
			return item
	return index.getParent(childId)
}

