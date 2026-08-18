import {Id, Kind} from "@omnimedia/omnitool"
import {ms, Ms} from "@omnimedia/omnitool/x/units/ms.js"

import {Idx} from "../../../../index.js"
import {PositionEdit} from "./edit.js"
import type {Position} from "./edit.js"
import {blocked as sequencePositionBlocked} from "../../../../drafts/sequence/placement.js"
import type {DropIntent} from "../intent.js"
import type {DragSnapshot} from "../snapshot.js"

type PositionPreview = {
	snapshot: DragSnapshot
	movingId: Id
	desiredStart: Ms
	drop: DropIntent | null
}

export function resolvePositionDrop({
	snapshot,
	movingId,
	drop,
}: PositionPreview) {
	if (!isEdgeDrop(drop))
		return drop

	const target = snapshot.index.getItem(drop.targetId)

	if (Idx.isTransition(target))
		return drop

	const targetSequence = getTargetSequence(snapshot, target)
	const sourceSequence = snapshot.index.getParent(movingId)

	if (!targetSequence)
		return null

	return targetSequence.id !== sourceSequence?.id
		? drop
		: null
}

export function isPositionDropBlocked({
	snapshot,
	movingId,
	desiredStart,
	drop,
}: PositionPreview) {
	if (drop)
		return isTransitionDrop(snapshot, drop)

	const sequence = snapshot.index.getParent(movingId)
	if (sequence?.kind !== Kind.Sequence)
		return false

	const start = positionWithinSequence(
		snapshot,
		sequence.id,
		desiredStart,
	)

	return sequencePositionBlocked(
		snapshot.index,
		sequence.id,
		movingId,
		start,
	)
}

export function overlayFromPosition(position: Position) {
	return new PositionEdit(position).overlay()
}

function isEdgeDrop(
	drop: DropIntent | null,
): drop is DropIntent {
	return !!drop && (
		drop.edge === "left" ||
		drop.edge === "right"
	)
}

function isTransitionDrop(
	snapshot: DragSnapshot,
	drop: DropIntent,
) {
	return Idx.isTransition(
		snapshot.index.getItem(drop.targetId),
	)
}

function getTargetSequence(
	snapshot: DragSnapshot,
	target: Idx.AnyItem,
) {
	if (target.kind === Kind.Sequence)
		return target

	const parent = snapshot.index.getParent(target.id)
	return parent?.kind === Kind.Sequence
		? parent
		: null
}

function positionWithinSequence(
	snapshot: DragSnapshot,
	sequenceId: Id,
	desiredStart: Ms,
) {
	const viewedStart = snapshot.index.getItemLaneStart(
		snapshot.viewedId,
	)
	const absoluteStart = viewedStart + desiredStart
	const sequenceStart = snapshot.index.getItemLaneStart(
		sequenceId,
	)

	return ms(Math.max(0, absoluteStart - sequenceStart))
}

