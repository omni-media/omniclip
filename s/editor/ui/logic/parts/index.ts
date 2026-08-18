
import {GMap} from '@e280/stz'
import {ms, Ms} from '@omnimedia/omnitool/x/units/ms.js'
import {Id, Item, Kind, TimelineFile} from '@omnimedia/omnitool'
import {computeItemDuration} from '@omnimedia/omnitool/x/timeline/renderers/parts/handy.js'

export namespace Idx {
	export type Text = Item.Text & {start?: number}
	export type Image = Item.Image & {start?: number}
	export type Clip = Item.Audio | Item.Video | Item.Caption | Image | Text
	export type Struct = Item.Sequence | Item.Stack
	export type AnyItem = Item.Any

	export function isSequence(kind: Kind) {
		return kind === Kind.Sequence
	}

	export function isStack(kind: Kind) {
		return kind === Kind.Stack
	}

	export function isTransition(item: AnyItem): item is Item.Transition {
		return item.kind === Kind.Transition
	}

	export function isTransitionKind(kind?: Kind) {
		return kind === Kind.Transition
	}

	export function isStructKind(kind: Kind) {
		return isStack(kind) || isSequence(kind)
	}

	export function isStruct(item: AnyItem): item is Struct {
		return "childrenIds" in item
	}

	export function isClip(kind: Kind) {
		return kind === Kind.Audio || kind === Kind.Video || kind === Kind.Caption ||
			kind === Kind.Image || kind === Kind.Text
	}
}

export class Index {

	items = new GMap<Id, Idx.AnyItem>()
	parents = new GMap<Id, Idx.Struct>()
	laneStarts = new GMap<Id, Ms>()
	durations = new GMap<Id, Ms>()

	constructor(source: TimelineFile) {
		this.#reindex(source)
	}

	#reindex(state: TimelineFile) {
		this.items.clear()
		this.parents.clear()
		this.laneStarts.clear()
		this.durations.clear()

		for (const item of state.items) {
			this.items.set(item.id, item)
			if ('childrenIds' in item) {
				for (const childId of item.childrenIds)
					this.parents.set(childId, item)
			}
		}
		for (const item of state.items)
			this.durations.set(item.id, ms(computeItemDuration(item.id, state)))

		this.#indexLaneStarts(state.rootId, ms(0))
	}

	getItem<T extends Idx.AnyItem>(id: Id) {
		return this.items.require(id) as T
	}

	getItemMaybe<T extends Idx.AnyItem>(id?: Id | null) {
		return id == null ? undefined : this.items.get(id) as T | undefined
	}

	getParent(childId: Id) {
		return this.parents.get(childId)
	}

	getParentMaybe(childId?: Id | null) {
		return childId == null ? undefined : this.getParent(childId)
	}

	contains(containerId: Id, itemId: Id): boolean {
		if (containerId === itemId)
			return true
		const parent = this.getParent(itemId)
		if (!parent)
			return false
		return this.contains(containerId, parent.id)
	}

	queryItem<T extends Idx.AnyItem = Idx.AnyItem>(
		predicate: (node: Idx.AnyItem) => boolean
	) {
		for (const item of this.queryItems<T>(predicate))
			return item
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

	getItemDuration(id: Id) {
		return this.durations.get(id) ?? ms(0)
	}

	#indexLaneStarts(id: Id, start: Ms) {
		const item = this.getItemMaybe(id)
		if (!item)
			return

		this.laneStarts.set(id, start)

		if (!('childrenIds' in item))
			return

		let cursor = start
		for (const childId of item.childrenIds) {
			this.#indexLaneStarts(childId, cursor)
			if (item.kind === Kind.Sequence)
				cursor = ms(cursor + this.getItemDuration(childId))
		}
	}
}
