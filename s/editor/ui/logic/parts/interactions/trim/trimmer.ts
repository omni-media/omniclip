
import {Item} from "@omnimedia/omnitool"
import {ms, Ms} from "@omnimedia/omnitool/x/units/ms.js"

import {OmniSession} from "../../../session.js"
import {overlayFromTrim} from "./parts/overlay.js"
import {Proposal} from "../../proposal/proposal.js"
import {metrics} from "../../../../pages/project/tabbing/tabs/edit/canvas/draw/styles.js"
import {TimelineClipBox} from "../../../../pages/project/tabbing/tabs/edit/canvas/draw/clip.js"

export type TrimEdge = "start" | "end"

export const cursorForTrimEdge = (edge: TrimEdge | null) =>
	edge === "start" ? "w-resize" : edge === "end" ? "e-resize" : "default"

export class Trimmer {
	#state: {
		clip: TimelineClipBox
		edge: TrimEdge
		item: Item.Video | Item.Audio | Item.Text
		laneStart: Ms
		lastOffset: number
	} | null = null

	get isTrimming() {
		return !!this.#state
	}

	start(clip: TimelineClipBox, edge: TrimEdge, session: OmniSession) {
		this.#state = {
			clip,
			edge,
			item: session.index.getItem(clip.itemId) as Item.Video | Item.Audio | Item.Text,
			laneStart: session.index.getItemLaneStart(clip.itemId, session.$viewedItemId.value),
			lastOffset: 0,
		}
	}

	preview(time: Ms, session: OmniSession) {
		if (!this.#state)
			return

		const {clip, edge, item, laneStart} = this.#state
		const isEnd = edge === "end"

		const offset = isEnd
			? Math.max(1, Math.min(item.duration, time - laneStart))
			: Math.max(0, Math.min(item.duration - 1, time - laneStart))

		const duration = ms(isEnd ? offset : item.duration - offset)
		const width = Math.max(metrics.clipMinWidth, session.viewport.durationToWidth(duration))
		this.#state.lastOffset = offset

		session.setProposal(isEnd ? new Proposal(session.timeline, overlayFromTrim({
			clipId: clip.itemId, edge, item, duration, offset
		})) : null)

		session.setGhostClip({
			...clip,
			width,
			x: isEnd ? clip.x : clip.x + clip.width - width,
		})

		session.canvas.scheduleDraw()
	}

	commit(session: OmniSession) {
		if (!this.#state)
			return

		const {clip, edge, item, lastOffset} = this.#state

		new Proposal(session.timeline, overlayFromTrim({
			clipId: clip.itemId,
			edge,
			item,
			duration: ms(edge === "end" ? lastOffset : item.duration - lastOffset),
			offset: lastOffset,
		})).commit()

		this.cancel(session)
	}

	cancel(session: OmniSession) {
		session.clearProposal()
		session.setGhostClip(null)
		this.#state = null
		session.canvas.scheduleDraw()
	}
}

