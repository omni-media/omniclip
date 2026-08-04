
import {OmniSession} from "../../../session.js"
import {DragSnapshot} from "./parts/snapshot.js"
import {resolveDropIntent} from "./parts/intent.js"
import {Proposal} from "../../proposal/proposal.js"
import {overlayFromDropIntent} from "./parts/overlay.js"
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
			),
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
		const ghost = {...clip, x: clip.x + dx, y: clip.y + dy}
		session.setGhostClip(ghost)

		const drop = resolveDropIntent(snapshot, clip.itemId, ghost)
		session.$drop.value = drop

		session.canvas.scheduleDraw()
	}

	commit(session: OmniSession) {
		const state = this.#state
		const drop = session.$drop.value
		if (this.isDragging && state && drop) {
			const overlay = overlayFromDropIntent({
				drop,
				index: state.snapshot.index,
				movingId: state.clip.itemId,
				newContainerId: session.deps.omnitool.getId(),
			})
			if (overlay)
				new Proposal(session.timeline, overlay).commit()
		}

		this.cancel(session)
	}

	cancel(session: OmniSession) {
		session.setGhostClip(null)
		session.$drop.value = null
		this.#state = null
		this.isDragging = false
		session.canvas.scheduleDraw()
	}
}
