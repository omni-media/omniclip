
import {tool} from "./tool.js"
import {Dragger} from "../drag/dragger.js"
import {Proposal} from "../proposal/proposal.js"
import {getDropIntent} from "../proposal/parts/intent.js"
import {overlayFromIntent} from "../proposal/parts/overlay.js"
import {metrics} from "../../../pages/project/tabbing/tabs/edit/canvas/draw/styles.js"

export const selectTool = tool("select", (session) => {
	const dragger = new Dragger()

	return {
	pointerdown: ({clip, inRuler, time, point}) => {
		if (inRuler) {
			session.deps.player.seek(time)
			session.setPlayhead(time)
			session.setGhostClip(null)
			session.setDropIntent(null)
			session.canvas.scheduleDraw()
			dragger.end()
			return
		}

		session.$selectedItem.value = clip?.itemId ?? null
		session.canvas.scheduleDraw()

		if (clip) dragger.start(clip, point, session)
		else dragger.end()
	},

	pointermove: ({point}) => {
		const drag = dragger.move(point)
		if (!drag)
			return

		const clampedX = Math.max(0, Math.min(
			session.canvas.contentWidth - drag.clip.width,
			drag.clip.x + drag.dx,
		))
		const clampedY = Math.max(metrics.rulerHeight + metrics.paddingY, Math.min(
			session.canvas.height - metrics.paddingY - drag.clip.height,
			drag.clip.y + drag.dy,
		))

		session.setGhostClip({
			...drag.clip,
			x: clampedX,
			y: clampedY,
		})

		const intent = getDropIntent({
			snapshot: drag.snapshot,
			movingId: drag.clipId,
			pointerX: point.x + session.viewport.scrollLeft,
			rowIndex: drag.snapshot.rowAt(point.y),
		})

		session.setDropIntent(intent ? {movingId: drag.clipId, intent} : null)
		if (intent) {
			const overlay = overlayFromIntent({
				index: drag.snapshot.index,
				movingId: drag.clipId,
				intent,
				getId: () => session.deps.omnitool.getId(),
			})

			session.setProposal(
				overlay ? new Proposal(session.timeline, overlay) : null
			)
		}
		else {
			session.clearProposal()
		}
		session.canvas.scheduleDraw()
	},

	pointerup: () => {
		if (dragger.isDragging) {
			session.$proposal.value?.commit()
		}
		session.clearProposal()
		session.setGhostClip(null)
		session.setDropIntent(null)
		dragger.end()
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

