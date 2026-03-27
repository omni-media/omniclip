
import {tool} from "./tool.js"
import {Proposal} from "../proposal/proposal.js"
import {getDropIntent} from "../proposal/parts/intent.js"
import {buildMoveOverlay} from "../proposal/parts/overlay.js"

type DragState = {
	clipId: number
	startPoint: {x: number, y: number}
	startTime: number
	dragging: boolean
}

export const selectTool = tool("select", (session) => {
	let drag: DragState | null = null

	return {
	pointerdown: ({clip, inRuler, time, point}) => {
		if (inRuler) {
			session.deps.player.seek(time)
			session.setPlayhead(time)
			session.canvas.scheduleDraw()
			drag = null
			return
		}

		session.$selectedItem.value = clip?.itemId ?? null
		session.canvas.scheduleDraw()

		drag = clip
			? {clipId: clip.itemId, startPoint: point, startTime: time, dragging: false}
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
		const intent = getDropIntent({
			session,
			movingId: drag.clipId,
			point,
		})

		if (!intent)
			return

		const overlay = buildMoveOverlay({
			index: session.index,
			movingId: drag.clipId,
			intent,
			getId: () => session.deps.omnitool.getId(),
		})

		if (!overlay)
			return

		session.setProposal(new Proposal(session.timeline, overlay))
		session.canvas.scheduleDraw()
	},

	pointerup: () => {
		if (drag?.dragging) {
			session.$proposal.value?.commit()
			session.clearProposal()
		}
		drag = null
	},

	doubleclick: ({clip}) => {
		if (!clip?.enterable)
			return

		session.$viewedItemId.value = clip.itemId
		session.$selectedItem.value = clip.itemId
		session.canvas.scheduleDraw()
	}
}})

