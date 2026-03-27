
import {tool} from "./tool.js"
import {Proposal} from "../proposal/proposal.js"
import {getDropIntent} from "../proposal/parts/intent.js"
import {overlayFromIntent} from "../proposal/parts/overlay.js"
import {TimelineClipBox} from "../../../pages/project/tabbing/tabs/edit/canvas/draw/clip.js"
import {metrics} from "../../../pages/project/tabbing/tabs/edit/canvas/draw/styles.js"

type DragState = {
	clipId: number
	clip: TimelineClipBox
	startPoint: {x: number, y: number}
	dragging: boolean
}

export const selectTool = tool("select", (session) => {
	let drag: DragState | null = null

	return {
	pointerdown: ({clip, inRuler, time, point}) => {
		if (inRuler) {
			session.deps.player.seek(time)
			session.setPlayhead(time)
			session.setGhostClip(null)
			session.setDropIntent(null)
			session.canvas.scheduleDraw()
			drag = null
			return
		}

		session.$selectedItem.value = clip?.itemId ?? null
		session.canvas.scheduleDraw()

		drag = clip
			? {clipId: clip.itemId, clip, startPoint: point, dragging: false}
			: null
	},

	pointermove: ({point}) => {
		if (!drag)
			return

		const dx = point.x - drag.startPoint.x
		const dy = point.y - drag.startPoint.y
		if (!drag.dragging && Math.hypot(dx, dy) < 4)
			return

		drag.dragging = true
		const clampedX = Math.max(0, Math.min(
			session.canvas.contentWidth - drag.clip.width,
			drag.clip.x + dx,
		))
		const clampedY = Math.max(metrics.rulerHeight + metrics.paddingY, Math.min(
			session.canvas.height - metrics.paddingY - drag.clip.height,
			drag.clip.y + dy,
		))

		session.setGhostClip({
			...drag.clip,
			x: clampedX,
			y: clampedY,
		})

		const intent = getDropIntent({
			session,
			movingId: drag.clipId,
			point,
		})

		session.setDropIntent(intent ? {movingId: drag.clipId, intent} : null)
		session.canvas.scheduleDraw()
	},

	pointerup: ({point}) => {
		if (drag?.dragging) {
			const intent = getDropIntent({
				session,
				movingId: drag.clipId,
				point,
			})

			if (intent) {
				const overlay = overlayFromIntent({
					index: session.index,
					movingId: drag.clipId,
					intent,
					getId: () => session.deps.omnitool.getId(),
				})

				if (overlay) {
					new Proposal(session.timeline, overlay).commit()
				}
			}
		}
		session.clearProposal()
		session.setGhostClip(null)
		session.setDropIntent(null)
		drag = null
		session.canvas.scheduleDraw()
	},

	doubleclick: ({clip}) => {
		if (!clip?.enterable)
			return

		session.$viewedItemId.value = clip.itemId
		session.$selectedItem.value = clip.itemId
		session.canvas.scheduleDraw()
	}
}})

