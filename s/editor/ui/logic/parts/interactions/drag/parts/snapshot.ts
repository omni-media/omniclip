import {Id, Kind} from "@omnimedia/omnitool"

import {Idx, Index} from "../../../index.js"
import type {ClipBox} from "../../../../../pages/project/tabbing/tabs/edit/canvas/layout/layout.js"

export type DragBounds = {x: number, y: number, width: number, height: number}
export type DragPoint = {x: number, y: number}
export type DragEdge = "left" | "right" | "top" | "bottom"

/*Frozen geometry*/
export class DragSnapshot {
	constructor(
		public index: Index,
		public clips: ClipBox[],
		public viewedId: Id,
	) {}

	getBox(itemId: Id) {
		return this.clips.find(clip => clip.itemId === itemId) ?? null
	}

	boxAt(point: DragPoint, movingId: Id) {
		return this.clips.findLast(box =>
			!this.#belongsTo(box.itemId, movingId) &&
				contains(box, point)) ?? null
	}

	#childrenOf(parent: Idx.Struct, movingId: Id) {
		return parent.childrenIds
			.filter(id => id !== movingId)
			.map(id => this.getBox(id))
			.filter((box): box is ClipBox => !!box)
	}

	insertionAt(parent: Idx.Struct, movingId: Id, point: DragPoint) {
		const children = this.#childrenOf(parent, movingId)
		const isStack = parent.kind === Kind.Stack
		const index = isStack
			? this.#rowAt(children, point.y)
			: this.#columnAt(children, point.x)
		const next = children[index]
		const previous = children[index - 1]
		const sibling = next ?? previous
		if (!sibling)
			return null

		const inX = point.x >= sibling.x && point.x <= sibling.x + sibling.width
		const inY = point.y >= sibling.y && point.y <= sibling.y + sibling.height
		const across = isStack ? inY && !inX : inX && !inY
		const before = across
			? isStack ? point.x < sibling.x : point.y < sibling.y
			: !!next
		const vertical = isStack !== across
		const edge: DragEdge = vertical
			? before ? "top" : "bottom"
			: before ? "left" : "right"

		return {
			targetId: sibling.itemId,
			edge,
			indicator: edgeOf(sibling, edge),
		}
	}

	#rowAt(children: ClipBox[], y: number) {
		return children.filter(box => y >= box.y + box.height / 2).length
	}

	#columnAt(children: ClipBox[], x: number) {
		return children.filter(box => x >= box.x + box.width / 2).length
	}

	#belongsTo(itemId: Id, parentId: Id) {
		for (let id: Id | undefined = itemId; id != null; id = this.index.getParent(id)?.id)
			if (id === parentId)
				return true
		return false
	}
}

function contains(bounds: DragBounds, point: DragPoint) {
	return point.x >= bounds.x && point.x <= bounds.x + bounds.width &&
		point.y >= bounds.y && point.y <= bounds.y + bounds.height
}

export function edgeOf(box: DragBounds, edge: DragEdge): DragBounds {
	const before = edge === "left" || edge === "top"
	return edge === "left" || edge === "right"
		? {x: before ? box.x : box.x + box.width, y: box.y, width: 0, height: box.height}
		: {x: box.x, y: before ? box.y : box.y + box.height, width: box.width, height: 0}
}

