import {Id, Item} from "@omnimedia/omnitool"
import {Ms} from "@omnimedia/omnitool/x/units/ms.js"

import {TimelineDraft} from "../timeline.js"
import {normalize as normalizeItems} from "./normalize.js"
import {
	blocked as isPlacementBlocked,
	place as placeItems,
} from "./placement.js"

export class Draft {
	constructor(
		private timeline: TimelineDraft,
		private id: Id,
		private getId: () => Id,
	) {}

	place(
		movingId: Id,
		at: Ms,
		preserveSourceSlot = true,
	) {
		const sequence = this.#getSequence()
		if (!sequence)
			return false

		const items = placeItems(
			this.timeline.index,
			sequence,
			movingId,
			at,
			this.getId,
			preserveSourceSlot,
		)

		if (!items)
			return false

		this.timeline.setChildren(sequence, items)
		return true
	}

	isBlocked(movingId: Id, at: Ms) {
		return isPlacementBlocked(
			this.timeline.index,
			this.id,
			movingId,
			at,
		)
	}

	normalize() {
		const sequence = this.#getSequence()
		if (!sequence)
			return

		const items = normalizeItems(
			this.timeline.index,
			sequence,
		)

		this.timeline.setChildren(sequence, items)
	}

	#getSequence() {
		return this.timeline.index.getItemMaybe<Item.Sequence>(this.id)
	}
}
