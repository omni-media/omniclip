
import {Id, Item} from "@omnimedia/omnitool"

import {Index} from "../../../index.js"
import {DropIntent} from "./intent.js"
import {spliceChildren, wrapChildInSequence} from "../../../operations.js"

export type OverlayFromIntentOpts = {
	index: Index
	movingId: Id
	intent: DropIntent
	getId: () => Id
}

type Context<T extends DropIntent["type"]> = {
	index: Index
	movingId: Id
	intent: Extract<DropIntent, {type: T}>
	getId: () => Id
}

type ReorderContext = {
	index: Index
	movingId: Id
	intent: Extract<DropIntent, {type: "sequence" | "stack"}>
}

const reorder = ({index, movingId, intent}: ReorderContext) => {
	const parent = index.getItem<Item.Sequence | Item.Stack>(intent.parentId)
	const childrenIds = spliceChildren(parent.childrenIds, movingId, intent.index)
	if (parent.childrenIds.every((id, i) => id === childrenIds[i])) return null
	return [[parent.id, {...parent, childrenIds}]]
}

const stackSequence = ({index, movingId, intent}: Context<"stack-sequence">) => {
	const stack = index.getItem<Item.Stack>(intent.stackId)
	const seq = index.getItem<Item.Sequence>(intent.sequenceId)
	return [
		[stack.id, {...stack, childrenIds: stack.childrenIds.filter(id => id !== movingId)}],
		[seq.id, {...seq, childrenIds: spliceChildren(seq.childrenIds, movingId, intent.index)}],
	]
}

const stackWrapLeaf = ({index, movingId, intent, getId}: Context<"stack-wrap-leaf">) => {
	const stack = index.getItem<Item.Stack>(intent.stackId)
	const seqId = getId()
	const seqChildrenIds = intent.before ? [movingId, intent.targetId] : [intent.targetId, movingId]
	const wrapped = wrapChildInSequence(
		stack,
		intent.targetId,
		seqId,
		seqChildrenIds,
		[movingId],
	)

	return [
		[stack.id, wrapped.parent],
		[seqId, wrapped.sequence],
	]
}

const strategies: Record<string, (ctx: any) => any> = {
	sequence: reorder,
	stack: reorder,
	"stack-sequence": stackSequence,
	"stack-wrap-leaf": stackWrapLeaf,
}

export function overlayFromIntent(ctx: OverlayFromIntentOpts) {
	const handler = strategies[ctx.intent.type]
	const patches = handler ? handler(ctx) : null
	return patches ? new Map<Id, Item.Any | null>(patches) : null
}

