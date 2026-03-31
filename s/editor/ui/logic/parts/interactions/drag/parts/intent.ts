
import {Id, Kind} from "@omnimedia/omnitool"

import {DragSnapshot} from "./snapshot.js"

export type DropIntent =
	| {type: "sequence", parentId: Id, index: number}
	| {type: "stack", parentId: Id, index: number}
	| {type: "stack-sequence", stackId: Id, sequenceId: Id, index: number}
	| {type: "stack-wrap-leaf", stackId: Id, targetId: Id, before: boolean}

type GetDropIntentOpts = {
	snapshot: DragSnapshot
	movingId: Id
	pointerX: number
	rowIndex: number
}

export function getDropIntent({snapshot, movingId, pointerX, rowIndex}: GetDropIntentOpts): DropIntent | null {
	const item = snapshot.index.getItem(movingId)
	const parent = snapshot.index.getParent(movingId)

	if (parent?.kind === Kind.Sequence) {
		return {
			type: "sequence",
			parentId: parent.id,
			index: snapshot.getInsertIndex(parent.id, item.id, pointerX),
		}
	}

	const viewed = snapshot.index.getItem(snapshot.viewedId)
	if (viewed.kind !== Kind.Stack || !viewed.childrenIds.includes(item.id))
		return null

	const targetId = viewed.childrenIds[rowIndex]
	if (targetId == null || targetId === item.id) {
		return {
			type: "stack",
			parentId: viewed.id,
			index: rowIndex,
		}
	}

	const target = snapshot.index.getItem(targetId)
	if (target.kind === Kind.Sequence) {
		return {
			type: "stack-sequence",
			stackId: viewed.id,
			sequenceId: target.id,
			index: snapshot.getInsertIndex(target.id, item.id, pointerX),
		}
	}

	const targetBox = snapshot.getBox(target.id)
	return {
		type: "stack-wrap-leaf",
		stackId: viewed.id,
		targetId: target.id,
		before: !(targetBox && pointerX >= targetBox.x + targetBox.width / 2),
	}
}

