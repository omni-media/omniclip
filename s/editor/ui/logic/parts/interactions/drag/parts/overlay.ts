
import {Id, Item} from "@omnimedia/omnitool"

import {Index} from "../../../index.js"
import {DropIntent} from "./intent.js"
import {spliceChildren, wrapChildInSequence} from "../../../operations/operations.js"

export type OverlayFromIntentOpts = {
	index: Index
	movingId: Id
	intent: DropIntent
	getId: () => Id
}

type Patch = [Id, Item.Any | null]

const unchanged = (before: readonly Id[], after: readonly Id[]) =>
	before.every((id, i) => id === after[i])

const overlay = (...patches: Patch[]) =>
	new Map<Id, Item.Any | null>(patches)

export function overlayFromIntent({index, movingId, intent, getId}: OverlayFromIntentOpts) {
	switch (intent.type) {
		case "sequence-reorder": {
			const seq = index.getItem<Item.Sequence>(intent.sequenceId)
			const childrenIds = spliceChildren(seq.childrenIds, movingId, intent.index)
			if (unchanged(seq.childrenIds, childrenIds)) return null
			return overlay([seq.id, {...seq, childrenIds}])
		}

		case "sequence-insert": {
			const source = index.getParent(movingId)
			if (!source) return null

			const seq = index.getItem<Item.Sequence>(intent.sequenceId)
			return overlay(
				[source.id, {...source, childrenIds: source.childrenIds.filter(id => id !== movingId)}],
				[seq.id, {...seq, childrenIds: spliceChildren(seq.childrenIds, movingId, intent.index)}],
			)
		}

		case "stack": {
			const parent = index.getItem<Item.Stack>(intent.parentId)
			const childrenIds = spliceChildren(parent.childrenIds, movingId, intent.index)
			if (unchanged(parent.childrenIds, childrenIds)) return null
			return overlay([parent.id, {...parent, childrenIds}])
		}

		case "stack-wrap-leaf": {
			const stack = index.getItem<Item.Stack>(intent.stackId)
			const source = index.getParent(movingId)
			const seqId = getId()
			const seqChildrenIds = intent.before ? [movingId, intent.targetId] : [intent.targetId, movingId]
			const wrapped = wrapChildInSequence(
				stack,
				intent.targetId,
				seqId,
				seqChildrenIds,
				[movingId],
			)

			return source && source.id !== stack.id
				? overlay(
					[source.id, {...source, childrenIds: source.childrenIds.filter(id => id !== movingId)}],
					[stack.id, wrapped.parent],
					[seqId, wrapped.sequence],
				)
				: overlay(
					[stack.id, wrapped.parent],
					[seqId, wrapped.sequence],
				)
		}
	}
}

