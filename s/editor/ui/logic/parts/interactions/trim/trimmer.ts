
import {Item, Kind} from "@omnimedia/omnitool"
import {Ms, ms} from "@omnimedia/omnitool/x/units/ms.js"

import {Idx} from "../../index.js"
import {trim} from "./parts/action.js"
import {getBounds} from "../../bounds.js"
import {OmniSession} from "../../../session.js"
import {Proposal} from "../../proposal/proposal.js"
import {overlayFromTrim} from "./parts/overlay.js"
import {trimTransition} from "./parts/transition.js"
import {TimelineClipBox} from "../../../../pages/project/tabbing/tabs/edit/canvas/draw/clip.js"

export type TrimEdge = "start" | "end"

export const cursorForTrimEdge = (edge: TrimEdge | null) =>
	edge === "start" ? "w-resize" : edge === "end" ? "e-resize" : "default"

export class Trimmer {
	#state: {
		edge: TrimEdge
		item: Idx.Clip | Item.Transition
		laneStart: Ms
		prev?: Idx.Clip
		next?: Idx.Clip
	} | null = null

	get isTrimming() {
		return !!this.#state
	}

	start(clip: TimelineClipBox, edge: TrimEdge, session: OmniSession) {
		const item = session.index.getItem<Idx.Clip | Item.Transition>(clip.itemId)
		const parent = session.index.getParent(item.id)
		const siblings = parent?.kind === Kind.Sequence ? parent.childrenIds : null
		const idx = siblings?.indexOf(item.id) ?? -1

		this.#state = {
			edge,
			item,
			laneStart: session.index.getItemLaneStart(clip.itemId, session.$viewedItemId.value),
			prev: item.kind === Kind.Transition ? session.index.getItemMaybe<Idx.Clip>(siblings?.[idx - 1]) : undefined,
			next: item.kind === Kind.Transition ? session.index.getItemMaybe<Idx.Clip>(siblings?.[idx + 1]) : undefined,
		}
	}

	preview(time: Ms, session: OmniSession) {
		if (!this.#state)
			return

		const {edge, item, laneStart, prev, next} = this.#state

		if (item.kind === Kind.Transition) {
			session.setProposal(new Proposal(session.timeline, trimTransition(item, edge, time, laneStart, prev, next, session)))
			session.setGhostClip(null)
			session.setTrimPreviewOffsetPx(0)
			session.canvas.scheduleDraw()
			return
		}

		const mediaDuration = session.deps.resolveMedia(item)?.duration
		const patched = trim(item, edge, time - laneStart, mediaDuration)

		session.setProposal(new Proposal(session.timeline, overlayFromTrim(item.id, patched)))
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

