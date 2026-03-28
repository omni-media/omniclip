
import {OmniSession} from "../../session.js"
import {DragSnapshot} from "./parts/snapshot.js"
import {TimelineClipBox} from "../../../pages/project/tabbing/tabs/edit/canvas/draw/clip.js"

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
				{
					clips: [...session.canvas.layout.clips],
					rows: session.canvas.layout.rows,
					duration: session.canvas.layout.duration,
				},
				session.$viewedItemId.value,
			)
		}
	}

	move(point: Point) {
		if (!this.#state) return null

		const {startPoint, clip, snapshot} = this.#state
		const dx = point.x - startPoint.x
		const dy = point.y - startPoint.y

		if (!this.isDragging && Math.hypot(dx, dy) < 4) return null

		this.isDragging = true
		return {dx, dy, snapshot, clipId: clip.itemId, clip}
	}

	end() {
		this.#state = null
		this.isDragging = false
	}
}

