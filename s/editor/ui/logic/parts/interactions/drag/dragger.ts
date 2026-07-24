
import {OmniSession} from "../../../session.js"
import {DragSnapshot} from "./parts/snapshot.js"
import {getDropIntent} from "./parts/intent.js"
import {Proposal} from "../../proposal/proposal.js"
import {overlayFromIntent} from "./parts/overlay.js"
import {TimelineClipBox} from "../../../../pages/project/tabbing/tabs/edit/canvas/draw/clip.js"

type Point = {x: number, y: number}

export class Dragger {
	#state: {
		clip: TimelineClipBox
		startPoint: Point
		snapshot: DragSnapshot
	} | null = null

	isDragging = false

	start(clip: TimelineClipBox, point: Point, session: OmniSession) {
		this.isDragging = false
		this.#state = {
			clip,
			startPoint: point,
			snapshot: new DragSnapshot(
				session.index,
				[...session.canvas.clips],
				session.$viewedItemId.value,
			)
		}
	}

	preview(point: Point, session: OmniSession) {
		if (!this.#state)
			return null

		const {startPoint, clip, snapshot} = this.#state
		const dx = point.x - startPoint.x
		const dy = point.y - startPoint.y

		if (!this.isDragging && Math.hypot(dx, dy) < 4)
			return null

		this.isDragging = true
		session.setGhostClip(
			session.canvas.clampClipToCanvasBounds(
				clip,
				clip.x + dx,
				clip.y + dy,
			)
		)

		const intent = getDropIntent({
			snapshot,
			movingId: clip.itemId,
			point: {x: point.x + session.viewport.scrollLeft, y: point.y},
		})
		const validIntent = intent

		session.setDropIntent(validIntent ? {movingId: clip.itemId, intent: validIntent} : null)

		if (validIntent) {
			const overlay = overlayFromIntent({
				index: snapshot.index,
				movingId: clip.itemId,
				intent: validIntent,
			})
			session.setProposal(overlay ? new Proposal(session.timeline, overlay) : null)
		}
		else {
			session.clearProposal()
		}

		session.canvas.scheduleDraw()
		return {dx, dy, snapshot, clipId: clip.itemId, clip}
	}

	commit(session: OmniSession) {
		if (this.isDragging) {
			session.$proposal.value?.commit()
		}

		this.cancel(session)
	}

	cancel(session: OmniSession) {
		session.clearProposal()
		session.setGhostClip(null)
		session.setDropIntent(null)
		this.end()
		session.canvas.scheduleDraw()
	}

	end() {
		this.#state = null
		this.isDragging = false
	}
}

