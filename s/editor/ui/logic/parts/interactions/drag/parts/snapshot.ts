
import {Id} from "@omnimedia/omnitool"

import {Index} from "../../../index.js"
import {metrics} from "../../../../../pages/project/tabbing/tabs/edit/canvas/draw/styles.js"
import {LayoutResult} from "../../../../../pages/project/tabbing/tabs/edit/canvas/layout/types.js"

export class DragSnapshot {
	constructor(
		public index: Index,
		public layout: LayoutResult,
		public viewedId: Id,
	) {}

	getBox(itemId: Id) {
		return this.layout.clips.find(clip => clip.itemId === itemId) ?? null
	}

	getInsertIndex(parentId: Id, movingId: Id, pointerX: number) {
		const parent = this.index.getItem(parentId)
		if (!("childrenIds" in parent))
			return 0

		const siblings = parent.childrenIds
			.filter(id => id !== movingId)
			.map(id => this.getBox(id))
			.filter(box => !!box)

		return siblings.filter(box => pointerX >= box.x + box.width / 2).length
	}

	rowAt(y: number) {
		const local = y - metrics.rulerHeight - metrics.paddingY
		if (local <= 0)
			return 0

		const row = Math.floor(local / (metrics.trackHeight + metrics.trackGap))
		return Math.max(0, Math.min(this.layout.rows - 1, row))
	}
}
