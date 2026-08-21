import {Chrono} from "@e280/strata"
import {Id, Item, TimelineFile} from "@omnimedia/omnitool"

import {Idx, Index} from "../index.js"
import {mergeOverlay, Overlay, Proposal} from "../proposal/proposal.js"

export class TimelineDraft {
	#overlay: Overlay
	#proposal: Proposal

	constructor(
		public source: Chrono<TimelineFile>,
		initial: Overlay = new Map(),
	) {
		this.#overlay = initial
		this.#proposal = new Proposal(source, initial)
	}

	get index(): Index {
		return this.#proposal.index
	}

	get overlay(): Overlay {
		return this.#overlay
	}

	merge(overlay: Overlay) {
		if (!overlay.size)
			return

		this.#overlay = mergeOverlay(this.#overlay, overlay)
		this.#proposal = new Proposal(this.source, this.#overlay)
	}

	setChildren(
		parent: Idx.Struct,
		items: Idx.AnyItem[],
	) {
		if (this.#hasSameChildren(parent, items))
			return

		const overlay: Overlay = new Map()
		const childrenIds = items.map(item => item.id)
		const retainedIds = new Set(childrenIds)

		for (const id of parent.childrenIds)
			if (!retainedIds.has(id))
				overlay.set(id, null)

		for (const item of items)
			if (this.index.getItemMaybe(item.id) !== item)
				overlay.set(item.id, item)

		overlay.set(parent.id, {
			...parent,
			childrenIds,
		})

		this.merge(overlay)
	}

	remove(...ids: Id[]) {
		const overlay: Overlay = new Map(
			ids.map(id => [id, null]),
		)

		this.merge(overlay)
	}

	set(item: Item.Any) {
		const overlay: Overlay = new Map([
			[item.id, item],
		])

		this.merge(overlay)
	}

	#hasSameChildren(
		parent: Idx.Struct,
		items: Idx.AnyItem[],
	) {
		return (
			parent.childrenIds.length === items.length &&
			items.every(
				(item, i) =>
					this.index.getItem(parent.childrenIds[i]) === item,
			)
		)
	}
}
