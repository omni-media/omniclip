
import {Id, Item, Kind} from "@omnimedia/omnitool"

import {Index} from "../../../index.js"
import {metrics} from "../../../../../pages/project/tabbing/tabs/edit/canvas/draw/styles.js"
import type {ClipBox} from "../../../../../pages/project/tabbing/tabs/edit/canvas/layout/layout.js"

export type DragPoint = {x: number, y: number}

export class DragSnapshot {
	constructor(
		public index: Index,
		public clips: ClipBox[],
		public viewedId: Id,
	) {}

	getBox(itemId: Id) {
		return this.clips.find(clip => clip.itemId === itemId) ?? null
	}

	clipAt(point: DragPoint) {
		return this.clips.find(box =>
			point.x >= box.x && point.x <= box.x + box.width &&
			point.y >= box.y && point.y <= box.y + box.height
		) ?? null
	}

	getInsertIndex(parent: Item.Sequence | Item.Stack, movingId: Id, point: DragPoint) {
		return parent.kind === Kind.Sequence
			? this.#columnAt(parent, movingId, point.x)
			: this.#rowAt(point.y)
	}

	#columnAt(parent: Item.Sequence, movingId: Id, x: number) {
		const siblings = parent.childrenIds
			.filter(id => id !== movingId)
			.map(id => this.getBox(id))
			.filter(box => !!box)

		return siblings.filter(box => x >= box.x + box.width / 2).length
	}

	#rowAt(y: number) {
		const local = y - metrics.rulerHeight - metrics.paddingY
		return local <= 0 ? 0 : Math.floor(local / (metrics.trackHeight + metrics.trackGap))
	}

}
