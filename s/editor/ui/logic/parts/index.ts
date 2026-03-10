
import {GMap} from '@e280/stz'
import {Chrono} from '@e280/strata'
import {Id, Item, Kind, TimelineFile} from '@omnimedia/omnitool'

export namespace Idx {
	export type Clip = Item.Audio | Item.Video | Item.Text
	export type Struct = Item.Sequence | Item.Stack
	export type AnyItem =
		| Item.Audio
		| Item.Video
		| Item.Text
		| Item.Gap
		| Item.Sequence
		| Item.Stack
		| Item.Spatial
		| Item.Transition
		| Item.TextStyle
}

export class Index {

	items = new GMap<Id, Idx.AnyItem>()
	parents = new GMap<Id, Idx.Struct>()
	starts = new GMap<Id, number>()

	constructor(strata: Chrono<TimelineFile>) {
		this.reindex(strata.state as TimelineFile)
		strata.lens
		strata.lens(s => s).on(state => {
			this.reindex(state as TimelineFile)
		})
	}

	reindex(state: TimelineFile) {
		this.items.clear()
		this.parents.clear()
		this.starts.clear()

		for (const item of state.items) {
			this.items.set(item.id, item)
			if ('childrenIds' in item) {
				for (const childId of item.childrenIds)
					this.parents.set(childId, item)
			}
		}

		this.#indexStarts(state.rootId, 0)
	}

	getItem<T extends Idx.AnyItem>(id: Id) {
		return this.items.require(id) as T
	}

	getParent(childId: Id) {
		return this.parents.get(childId)
	}

	*queryItems<T extends Idx.AnyItem = Idx.AnyItem>(
    	predicate: (node: Idx.AnyItem) => boolean
	) {
    for (const item of this.items.values()) {
      if (predicate(item)) {
        yield item as T
      }
    }
	}

	getItemStart(id: Id, relativeToId?: Id) {
		const absStart = this.starts.get(id)
		if (absStart == null)
			return 0

		if (!relativeToId)
			return absStart

		const rootStart = this.starts.get(relativeToId) ?? 0
		return absStart - rootStart
	}

	#indexStarts(id: Id, start: number) {
		const item = this.getItem(id)

		this.starts.set(id, start)

		if (!('childrenIds' in item))
			return

		switch (item.kind) {

			case Kind.Sequence: {
				let cursor = start

				for (const childId of item.childrenIds) {
					const child = this.getItem(childId)
					const childStart = 'start' in child ? (child.start ?? cursor) : cursor

					this.#indexStarts(childId, childStart)

					if ('duration' in child)
						cursor = Math.max(cursor, childStart + child.duration)
				}

				break
			}

			case Kind.Stack: {
				for (const childId of item.childrenIds)
					this.#indexStarts(childId, start)

				break
			}

			default:
				break
		}
	}
}
