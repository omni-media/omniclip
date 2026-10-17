
import {Id, Kind} from "@omnimedia/omnitool"

import {Idx} from "../../../index.js"
import {DragSnapshot, edgeOf, type DragBounds, type DragEdge, type DragPoint} from "./snapshot.js"

/*Interpret the gesture*/

export type DropIntent = {targetId: Id, edge: DragEdge, indicator: DragBounds}

export function resolveDropIntent(snapshot: DragSnapshot, movingId: Id, bounds: DragBounds): DropIntent | null {
	const point = centerOf(bounds)
	const sourceParent = snapshot.index.getParent(movingId)
	if (!sourceParent)
		return null

	const hoveredBox = snapshot.boxAt(point, movingId)
	const hoveredItem = snapshot.index.getItemMaybe(hoveredBox?.itemId)

	if (hoveredBox && hoveredItem && !Idx.isStruct(hoveredItem)) {
		const drop = dropOnHoveredLeaf(snapshot, movingId, hoveredItem, hoveredBox, point)
		if (drop)
			return drop
	}

	const edgeDrop = dropAtSourceContainerEdge(snapshot, sourceParent, point)
	if (edgeDrop)
		return edgeDrop

	if (hoveredItem && Idx.isStruct(hoveredItem))
		return snapshot.insertionAt(hoveredItem, movingId, point)

	const viewedStruct = snapshot.index.getItem<Idx.Struct>(snapshot.viewedId)
	return snapshot.insertionAt(viewedStruct, movingId, point)
}

function dropOnHoveredLeaf(
	snapshot: DragSnapshot,
	movingId: Id,
	hoveredItem: Idx.AnyItem,
	hoveredBox: DragBounds,
	point: DragPoint,
): DropIntent | null {
	const parent = snapshot.index.getParent(hoveredItem.id)
	if (!parent)
		return null

	if (parent.kind === Kind.Stack && hoveredItem.kind !== Kind.Gap) {
		const edge = horizontalEdge(hoveredBox, point.x)
		return dropAt(hoveredItem.id, hoveredBox, edge)
	}

	return snapshot.insertionAt(parent, movingId, point)
}

function dropAtSourceContainerEdge(
	snapshot: DragSnapshot,
	sourceParent: Idx.Struct,
	point: DragPoint,
): DropIntent | null {
	const sourceParentBox = snapshot.getBox(sourceParent.id)
	const sourceGrandparent = snapshot.index.getParent(sourceParent.id)

	const isReorderableContainer =
		sourceParentBox &&
		sourceGrandparent?.kind === sourceParent.kind &&
		sourceParent.childrenIds.length > 1

	if (!isReorderableContainer)
		return null

	const edge = outsideEdge(sourceParentBox, point, sourceParent.kind)
	return edge ? dropAt(sourceParent.id, sourceParentBox, edge) : null
}

function centerOf(bounds: DragBounds): DragPoint {
	return {x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2}
}

function dropAt(targetId: Id, box: DragBounds, edge: DragEdge): DropIntent {
	return {targetId, edge, indicator: edgeOf(box, edge)}
}

function horizontalEdge(box: DragBounds, x: number): DragEdge {
	return x < box.x + box.width / 2 ? "left" : "right"
}

function outsideEdge(box: DragBounds, point: DragPoint, kind: Kind.Stack | Kind.Sequence): DragEdge | null {
	if (kind === Kind.Stack) {
		if (point.x < box.x) return "left"
		if (point.x > box.x + box.width) return "right"
	} else {
		if (point.y < box.y) return "top"
		if (point.y > box.y + box.height) return "bottom"
	}
	return null
}

