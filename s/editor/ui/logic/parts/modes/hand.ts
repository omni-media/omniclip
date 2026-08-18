
import {tool} from "./tool.js"

type PanState = {
	startX: number
	startScrollLeft: number
}

export const handTool = tool("hand", (session) => {
	let pan: PanState | null = null

	return {
		pointerdown: ({point}) => {
			pan = {
				startX: point.x,
				startScrollLeft: session.viewport.scrollLeft,
			}
			session.canvas.canvas.style.cursor = "grabbing"
		},

		pointermove: ({point}) => {
			if (!pan)
				return

			const maxScrollLeft = Math.max(
				0,
				session.canvas.contentWidth - session.canvas.width,
			)
			const scrollLeft = pan.startScrollLeft - (point.x - pan.startX)
			session.viewport.setScrollLeft(
				Math.max(0, Math.min(maxScrollLeft, scrollLeft)),
			)
			session.canvas.scheduleDraw()
		},

		pointerup: () => {
			pan = null
			session.canvas.switchCursor("hand")
		},

		pointerleave: () => {
			pan = null
			session.canvas.switchCursor("hand")
		},
	}
})

