
import {Ms, ms} from "@omnimedia/omnitool/x/units/ms.js"

import {trim} from "./parts/action.js"
import {OmniSession} from "../../../session.js"
import {Proposal} from "../../proposal/proposal.js"
import {overlayFromTrim} from "./parts/overlay.js"
import {getBounds, TimelineClip} from "../../bounds.js"
import {TimelineClipBox} from "../../../../pages/project/tabbing/tabs/edit/canvas/draw/clip.js"

export type TrimEdge = "start" | "end"

export const cursorForTrimEdge = (edge: TrimEdge | null) =>
	edge === "start" ? "w-resize" : edge === "end" ? "e-resize" : "default"

export class Trimmer {
	#state: {
		clip: TimelineClipBox
		edge: TrimEdge
		item: TimelineClip
		laneStart: Ms
	} | null = null

	get isTrimming() {
		return !!this.#state
	}

	start(clip: TimelineClipBox, edge: TrimEdge, session: OmniSession) {
		this.#state = {
			clip,
			edge,
			item: session.index.getItem(clip.itemId),
			laneStart: session.index.getItemLaneStart(clip.itemId, session.$viewedItemId.value),
		}
	}

	preview(time: Ms, session: OmniSession) {
		if (!this.#state)
			return

		const {clip, edge, item, laneStart} = this.#state
		const mediaDuration = session.deps.resolveMedia(item)?.duration
		const patched = trim(item, edge, time - laneStart, mediaDuration)

		session.setProposal(new Proposal(session.timeline, overlayFromTrim(clip.itemId, patched)))
		session.setGhostClip(null)
		const patchedStart = getBounds(patched).start
		const itemStart = getBounds(item).start
		session.setTrimPreviewOffsetPx(
			edge === "end"
				? 0
				: session.viewport.durationToWidth(ms(patchedStart - itemStart))
		)

		session.canvas.scheduleDraw()
	}

	commit(time: Ms, session: OmniSession) {
		if (!this.#state)
			return

		const {clip, edge, item, laneStart} = this.#state
		const mediaDuration = session.deps.resolveMedia(item)?.duration
		const patched = trim(item, edge, time - laneStart, mediaDuration)

		new Proposal(session.timeline, overlayFromTrim(clip.itemId, patched)).commit()

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

