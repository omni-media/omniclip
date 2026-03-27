
import {Id, Kind} from "@omnimedia/omnitool"
import {OmniSession} from "../../../session.js"


export type DropIntent =
	| {type: "sequence", parentId: Id, index: number}
	| {type: "stack", parentId: Id, index: number}
	| {type: "stack-sequence", stackId: Id, sequenceId: Id, index: number}
	| {type: "stack-wrap-leaf", stackId: Id, targetId: Id, before: boolean}

type GetDropIntentOpts = {
	session: OmniSession
	movingId: Id
	point: {x: number, y: number}
}

export function getDropIntent({session, movingId, point}: GetDropIntentOpts): DropIntent | null {
	const pointerX = point.x + session.viewport.scrollLeft
	const item = session.index.getItem(movingId)
	const parent = session.index.getParent(movingId)

	if (parent?.kind === Kind.Sequence) {
		return {
			type: "sequence",
			parentId: parent.id,
			index: session.canvas.getInsertIndex(parent.id, item.id, pointerX),
		}
	}

	const viewed = session.index.getItem(session.$viewedItemId.value)
	if (viewed.kind !== Kind.Stack || !viewed.childrenIds.includes(item.id))
		return null

	const index = session.canvas.rowAt(point.y)
	const targetId = viewed.childrenIds[index]
	if (targetId == null || targetId === item.id) {
		return {
			type: "stack",
			parentId: viewed.id,
			index
		}
	}

	const target = session.index.getItem(targetId)
	if (target.kind === Kind.Sequence) {
		return {
			type: "stack-sequence",
			stackId: viewed.id,
			sequenceId: target.id,
			index: session.canvas.getInsertIndex(target.id, item.id, pointerX),
		}
	}

	const targetBox = session.canvas.getBox(target.id)
	return {
		type: "stack-wrap-leaf",
		stackId: viewed.id,
		targetId: target.id,
		before: !(targetBox && pointerX >= targetBox.x + targetBox.width / 2),
	}
}

