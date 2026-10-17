
import {Chrono} from "@e280/strata"
import {Id, Item, TimelineFile} from "@omnimedia/omnitool"

import {Index} from "../index.js"
import {add, remove, update} from "../mutate.js"

export type Overlay = Map<Id, Item.Any | null>

export function mergeOverlay(...overlays: Overlay[]): Overlay {
	return new Map(overlays.flatMap(overlay => [...overlay]))
}

export class Proposal {
	state: TimelineFile
	index: Index

	constructor(
		public source: Chrono<TimelineFile>,
		public overlay: Overlay,
	) {
		const baseState = source.state
		const baseItems = [...baseState.items] as Item.Any[]
		const items = baseItems
			.filter(item => overlay.get(item.id) !== null)
			.map(item => overlay.get(item.id) ?? item)

		for (const [id, item] of overlay) {
			if (item && !baseItems.some(i => i.id === id)) {
				items.push(item)
			}
		}

		this.state = {...baseState, items}
		this.index = new Index(this.state)
	}

	commit() {
		if (this.overlay.size === 0) return

		this.source.mutate(state => {
			for (const [id, item] of this.overlay) {
				if (item) {
					const exists = state.items.some(i => i.id === id)
					if (exists) update(state, id, item)
					else add(state, item)
				} else {
					remove(state, id)
				}
			}
		})
	}
}

