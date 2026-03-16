
import {GMap} from '@e280/stz'
import {Chrono} from '@e280/strata'
import {ms, Ms} from '@omnimedia/omnitool/x/units/ms.js'
import {Id, Item, Kind, TimelineFile} from '@omnimedia/omnitool'

export namespace Idx {
	export type Clip = Item.Audio | Item.Video | Item.Text
	export type Struct = Item.Sequence | Item.Stack
	export type AnyItem = Item.Any
}

export class Index {

	items = new GMap<Id, Idx.AnyItem>()
	parents = new GMap<Id, Idx.Struct>()
	laneStarts = new GMap<Id, Ms>()

	constructor(strata: Chrono<TimelineFile>) {
		this.reindex(strata.state as TimelineFile)
		strata.lens(s => s).on(state => {
			this.reindex(state as TimelineFile)
		})
	}

	reindex(state: TimelineFile) {
		this.items.clear()
		this.parents.clear()
		this.laneStarts.clear()

		for (const item of state.items) {
			this.items.set(item.id, item)
			if ('childrenIds' in item) {
				for (const childId of item.childrenIds)
					this.parents.set(childId, item)
			}
		}

		this.#indexLaneStarts(state.rootId, ms(0))
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

	getItemLaneStart(id: Id, relativeToId?: Id) {
		const absStart = this.laneStarts.get(id)
		if (absStart == null)
			return ms(0)

		if (!relativeToId)
			return absStart

		const rootStart = this.laneStarts.get(relativeToId) ?? ms(0)
		return ms(absStart - rootStart)
	}

	#indexLaneStarts(id: Id, start: Ms) {
		const item = this.getItem(id)

		this.laneStarts.set(id, start)

		if (!('childrenIds' in item))
			return

		switch (item.kind) {

			case Kind.Sequence: {
				let cursor = start

				for (const childId of item.childrenIds) {
					const child = this.getItem(childId)

					this.#indexLaneStarts(childId, cursor)

					if ('duration' in child)
						cursor = ms(cursor + child.duration)
				}

				break
			}

			case Kind.Stack: {
				for (const childId of item.childrenIds)
					this.#indexLaneStarts(childId, start)

				break
			}

			default:
				break
		}
	}
}
