import {Id, Item, Kind} from "@omnimedia/omnitool"
import {ms, Ms} from "@omnimedia/omnitool/x/units/ms.js"

import {Idx, Index} from "../../index.js"
import {itemDuration, splitItem, withRange} from "../utils.js"

export function place(
	index: Index,
	sequence: Item.Sequence,
	movingId: Id,
	at: Ms,
	getId: () => Id,
	preserveSourceSlot = true,
) {
	const moving = index.getItem<Idx.Clip>(movingId)
	const duration = itemDuration(index, moving)

	const sourceSlot = preserveSourceSlot
		? [makeGap(duration, getId)]
		: []

	const items = sequenceChildren(index, sequence).flatMap(item =>
		item.id === movingId ? sourceSlot : [item]
	)

	if (blockedRange(index, items, at, duration))
		return null

	const placed = placeRange(
		index,
		items,
		moving,
		at,
		duration,
		getId,
	)

	if (!placed)
		return null

	return compact(index, placed)
}

export function blocked(
	index: Index,
	sequenceId: Id,
	movingId: Id,
	at: Ms,
) {
	const sequence = index.getItemMaybe<Item.Sequence>(sequenceId)
	if (!sequence)
		return false

	const duration = index.getItemDuration(movingId)
	const items = sequenceChildren(index, sequence)

	return blockedRange(index, items, at, duration)
}

function sequenceChildren(
	index: Index,
	sequence: Item.Sequence,
) {
	return sequence.childrenIds.map(id => index.getItem(id))
}

function placeRange(
	index: Index,
	items: Idx.AnyItem[],
	moving: Idx.Clip,
	start: Ms,
	duration: Ms,
	getId: () => Id,
) {
	const startSplit = splitAt(index, items, start, getId)
	if (!startSplit)
		return null

	const endSplit = splitAt(
		index,
		startSplit.after,
		duration,
		getId,
	)
	if (!endSplit)
		return null

	const before = fillTo(
		index,
		startSplit.before,
		start,
		getId,
	)

	return [
		...before,
		moving,
		...endSplit.after,
	]
}

function splitAt(
	index: Index,
	items: Idx.AnyItem[],
	at: Ms,
	getId: () => Id,
) {
	for (const {item, i, start, end} of withRange(index, items)) {
		if (at === start)
			return {
				before: items.slice(0, i),
				after: items.slice(i),
			}

		if (at >= end)
			continue

		const split = splitItem(
			item,
			ms(at - start),
			getId,
		)

		if (!split)
			return null

		return {
			before: [
				...items.slice(0, i),
				split.left,
			],
			after: [
				split.right,
				...items.slice(i + 1),
			],
		}
	}

	return {
		before: items,
		after: [],
	}
}

function fillTo(
	index: Index,
	items: Idx.AnyItem[],
	end: Ms,
	getId: () => Id,
) {
	const duration = items.reduce(
		(total, item) => total + itemDuration(index, item),
		0,
	)

	if (duration >= end)
		return items

	return [
		...items,
		makeGap(ms(end - duration), getId),
	]
}

function blockedRange(
	index: Index,
	items: Idx.AnyItem[],
	start: Ms,
	duration: Ms,
) {
	const end = ms(start + duration)

	for (const range of withRange(index, items)) {
		const protectedItem =
			Idx.isTransition(range.item) ||
			Idx.isStruct(range.item)

		const overlaps =
			range.start < end &&
			range.end > start

		if (protectedItem && overlaps)
			return true
	}

	return false
}

export function compact(
	index: Index,
	items: Idx.AnyItem[],
) {
	const result: Idx.AnyItem[] = []

	for (const item of items) {
		if (itemDuration(index, item) <= 0)
			continue

		const previous = result.at(-1)
		const adjacentGaps =
			previous?.kind === Kind.Gap &&
			item.kind === Kind.Gap

		if (!adjacentGaps) {
			result.push(item)
			continue
		}

		result[result.length - 1] = {
			...previous,
			duration: ms(previous.duration + item.duration),
		}
	}

	return result
}

const makeGap = (
	duration: Ms,
	getId: () => Id,
): Item.Gap => ({
	id: getId(),
	kind: Kind.Gap,
	duration,
})
