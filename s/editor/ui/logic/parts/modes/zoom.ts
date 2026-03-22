import {tool} from "./tool.js"

export const zoomTool = tool("zoom", (session) => ({
	pointerdown: ({time}) => {
		session.viewport.adjustZoomAt(session.viewport.timeToViewportX(time), 0.1)
		session.canvas.scheduleDraw()
	},
}))
