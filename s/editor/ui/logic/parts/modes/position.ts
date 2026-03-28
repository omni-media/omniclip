
import {tool} from "./tool.js"

type PanState = {
	startPoint: {x: number, y: number}
	startScrollLeft: number
}

export const positionTool = tool("position", (session) => {
	let pan: PanState | null = null

	return {
		pointerdown: ({point}) => {
			pan = {
				startPoint: point,
				startScrollLeft: session.viewport.scrollLeft,
			}
			session.canvas.canvas.style.cursor = "grabbing"
		},

		pointermove: ({point}) => {
			if (!pan)
				return

			const maxScrollLeft = Math.max(0, session.canvas.contentWidth - session.canvas.width)
			const nextScrollLeft = pan.startScrollLeft - (point.x - pan.startPoint.x)
			session.viewport.setScrollLeft(
				Math.max(0, Math.min(maxScrollLeft, nextScrollLeft))
			)
			session.canvas.scheduleDraw()
		},

		pointerup: () => {
			pan = null
			session.canvas.switchCursor("position")
		},

		pointerleave: () => {
			pan = null
			session.canvas.switchCursor("position")
		},
	}
})

