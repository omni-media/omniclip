import {ms, Ms} from "@omnimedia/omnitool/x/units/ms.js"
import {Id, Item, Kind} from "@omnimedia/omnitool"

import {Idx} from "../../../../index.js"
import type {OmniSession} from "../../../../../session.js"
import {replaceChild} from "../../../../operations/operations.js"
import {TimelineDraft} from "../../../../drafts/timeline.js"
import {Draft as SequenceDraft} from "../../../../drafts/sequence/draft.js"
import {
	place as positionStackChild,
	positionLane as getPositionLane,
} from "../../../../drafts/stack/placement.js"
import {overlayFromDropIntent} from "../overlay.js"
import type {DropIntent} from "../intent.js"
import type {DragSnapshot} from "../snapshot.js"

export type Position = {
	session: OmniSession
	snapshot: DragSnapshot
	movingId: Id
	desiredStart: Ms
	drop: DropIntent | null
}

export class PositionEdit {
	constructor(private position: Position) {}

	overlay() {
		const {session, snapshot, movingId, drop} = this.position

		if (this.#isBlockedDrop())
			return new Map()

		const draft = new TimelineDraft(session.timeline)
		const sourceParent = snapshot.index.getParent(movingId)

		if (drop) {
			this.#prepareSourceForDrop(draft, sourceParent)
			this.#applyDropStructure(draft, sourceParent, drop)
		}

		return this.#positionItem(draft, sourceParent)
	}

	#isBlockedDrop() {
		const {snapshot, drop} = this.position
		return drop ? Idx.isTransition(snapshot.index.getItem(drop.targetId)) : false
	}

	#prepareSourceForDrop(
		draft: TimelineDraft,
		sourceParent: Idx.Struct | undefined,
	) {
		const {snapshot, movingId} = this.position
		const lane = getPositionLane(snapshot.index, movingId)

		if (lane) {
			this.#prepareLaneSource(draft, lane)
			return
		}

		if (sourceParent?.kind === Kind.Sequence && sourceParent.childrenIds.length > 1)
			this.#prepareSequenceSource(draft, sourceParent)
	}

	#prepareLaneSource(
		draft: TimelineDraft,
		lane: Idx.Struct,
	) {
		const {snapshot, movingId} = this.position
		const stack = snapshot.index.getParent(lane.id)!

		const otherLaneChildren = lane.childrenIds.filter(id => id !== movingId)

		draft.remove(...otherLaneChildren, lane.id)
		draft.set({
			...stack,
			childrenIds: replaceChild(
				stack.childrenIds,
				lane.id,
				[movingId],
			),
		})
	}

	#prepareSequenceSource(
		draft: TimelineDraft,
		sequence: Idx.Struct,
	) {
		const {session, snapshot, movingId} = this.position

		const gap: Item.Gap = {
			id: session.deps.omnitool.getId(),
			kind: Kind.Gap,
			duration: snapshot.index.getItemDuration(movingId),
		}

		draft.set(gap)
		draft.set({
			...sequence,
			childrenIds: replaceChild(
				sequence.childrenIds,
				movingId,
				[gap.id, movingId],
			),
		})
	}

	#applyDropStructure(
		draft: TimelineDraft,
		sourceParent: Idx.Struct | undefined,
		drop: DropIntent,
	) {
		const {session, movingId} = this.position
		const getId = () => session.deps.omnitool.getId()

		const overlay = overlayFromDropIntent({
			drop,
			index: draft.index,
			movingId,
			newContainerId: getId(),
		})

		if (overlay)
			draft.merge(overlay)

		if (sourceParent?.kind === Kind.Sequence)
			new SequenceDraft(draft, sourceParent.id, getId).normalize()
	}

	#positionItem(
		draft: TimelineDraft,
		sourceParent: Idx.Struct | undefined,
	) {
		const {movingId} = this.position
		const destinationParent = draft.index.getParent(movingId)

		if (!destinationParent)
			return draft.overlay

		const at = this.#positionWithinParent(draft, destinationParent)

		if (destinationParent.kind === Kind.Sequence)
			return this.#positionInSequence(
				draft,
				destinationParent,
				sourceParent,
				at,
			)

		return this.#positionInStack(draft, destinationParent, at)
	}

	#positionWithinParent(
		draft: TimelineDraft,
		parent: Idx.Struct,
	) {
		const {snapshot, desiredStart} = this.position

		const viewedStart = snapshot.index.getItemLaneStart(snapshot.viewedId)
		const absoluteStart = ms(viewedStart + desiredStart)
		const parentStart = draft.index.getItemLaneStart(parent.id)

		return ms(Math.max(0, absoluteStart - parentStart))
	}

	#positionInSequence(
		draft: TimelineDraft,
		sequence: Idx.Struct,
		sourceParent: Idx.Struct | undefined,
		at: Ms,
	) {
		const {session, movingId} = this.position
		const getId = () => session.deps.omnitool.getId()

		const positioned = new SequenceDraft(draft, sequence.id, getId).place(
			movingId,
			at,
			sourceParent?.id === sequence.id,
		)

		return positioned
			? draft.overlay
			: new Map()
	}

	#positionInStack(
		draft: TimelineDraft,
		stack: Idx.Struct,
		at: Ms,
	) {
		const {session, movingId} = this.position
		if (stack.kind !== Kind.Stack)
			return new Map()

		const getId = () => session.deps.omnitool.getId()

		const overlay = positionStackChild(
			stack,
			movingId,
			at,
			getId,
		)

		if (!overlay)
			return new Map()

		draft.merge(overlay)
		return draft.overlay
	}
}
