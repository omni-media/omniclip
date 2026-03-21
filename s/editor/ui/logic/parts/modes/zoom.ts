import {tool} from "./tool.js"
import {metrics} from "../../../pages/project/tabbing/tabs/edit/canvas/draw/styles.js"

export const zoomTool = tool("zoom", (session) => ({
	pointerdown: ({point}) => {
		const ghostTime = session.$ghostPlayhead.value
		const anchorX = ghostTime === null
			? point.x - metrics.paddingX
			: session.viewport.timeToViewportX(ghostTime)

		session.viewport.adjustZoomAt(anchorX, 0.1)
		session.canvas.scheduleDraw()
	},
}))
