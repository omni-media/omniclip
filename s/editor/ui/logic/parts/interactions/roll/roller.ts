
import {Ms, ms} from "@omnimedia/omnitool/x/units/ms.js"
import {Kind} from "@omnimedia/omnitool"

import {Idx} from "../../index.js"
import {roll} from "./parts/action.js"
import {OmniSession} from "../../../session.js"
import {Proposal} from "../../proposal/proposal.js"
import {overlayFromRoll} from "./parts/overlay.js"
import {TimelineClipBox} from "../../../../pages/project/tabbing/tabs/edit/canvas/draw/clip.js"

export type RollEdge = "start" | "end"

export const cursorForRoll = () => "col-resize"

export class Roller {
	#state: {
		leftItem: Idx.Clip
		rightItem: Idx.Clip
		boundaryTime: Ms
	} | null = null

	get isRolling() {
		return !!this.#state
	}

	start(clip: TimelineClipBox, edge: RollEdge, session: OmniSession) {
		const parent = session.index.getParent(clip.itemId)
		if (!parent || parent.kind !== Kind.Sequence)
			return

		const childIndex = parent.childrenIds.indexOf(clip.itemId)
		if (childIndex === -1)
			return

		const leftId = edge === "end"
			? parent.childrenIds[childIndex]
			: parent.childrenIds[childIndex - 1]
		const rightId = edge === "end"
			? parent.childrenIds[childIndex + 1]
			: parent.childrenIds[childIndex]

		if (leftId == null || rightId == null)
			return

		this.#state = {
			leftItem: session.index.getItem(leftId),
			rightItem: session.index.getItem(rightId),
			boundaryTime: session.index.getItemLaneStart(rightId, session.$viewedItemId.value),
		}
		session.setGhostClip(null)
		session.setTrimPreviewOffsetPx(0)
	}

	preview(time: Ms, session: OmniSession) {
		if (!this.#state)
			return

		const {leftItem, rightItem, boundaryTime} = this.#state
		const leftMediaDuration = session.deps.resolveMedia(leftItem)?.duration
		const rightMediaDuration = session.deps.resolveMedia(rightItem)?.duration
		const patched = roll(
			leftItem,
			rightItem,
			ms(time - boundaryTime),
			leftMediaDuration,
			rightMediaDuration,
		)

		session.setProposal(new Proposal(
			session.timeline,
			overlayFromRoll(patched.left, patched.right),
		))
		session.canvas.scheduleDraw()
	}

	commit(session: OmniSession) {
		if (!this.#state)
			return

		session.$proposal.value?.commit()

		this.cancel(session)
	}

	cancel(session: OmniSession) {
		session.clearProposal()
		session.setGhostClip(null)
		session.setTrimPreviewOffsetPx(0)
		this.#state = null
		session.canvas.scheduleDraw()
	}
}

