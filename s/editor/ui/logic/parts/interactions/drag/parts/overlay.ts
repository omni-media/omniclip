
import {Id} from "@omnimedia/omnitool"

import {Idx, Index} from "../../../index.js"
import {DropIntent} from "./intent.js"
import {spliceChildren} from "../../../operations/operations.js"

export type OverlayFromIntentOpts = {
	index: Index
	movingId: Id
	intent: DropIntent
}

const unchanged = (before: readonly Id[], after: readonly Id[]) =>
	before.length === after.length && before.every((id, i) => id === after[i])

export function overlayFromIntent({index, movingId, intent}: OverlayFromIntentOpts) {
	const source = index.getParent(movingId)
	if (!source)
		return null

	const parent = index.getItem<Idx.Struct>(intent.parentId)
	const childrenIds = spliceChildren(parent.childrenIds, movingId, intent.index)
	const sameParent = source.id === parent.id

	if (sameParent && unchanged(parent.childrenIds, childrenIds))
		return null

	const overlay = new Map([[parent.id, {...parent, childrenIds}]])
	if (!sameParent)
		overlay.set(source.id, {
			...source,
			childrenIds: source.childrenIds.filter(id => id !== movingId)
		})

	return overlay
}

