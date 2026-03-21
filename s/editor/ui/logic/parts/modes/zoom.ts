import {tool} from "./tool.js"
import {metrics} from "../../../pages/project/tabbing/tabs/edit/canvas/draw/styles.js"

export const zoomTool = tool("zoom", (session) => ({
	pointerdown: ({point}) => {
		session.viewport.zoomAt(point.x - metrics.paddingX, 0.1)
		session.canvas.scheduleDraw()
	},
}))
