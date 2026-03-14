
import {tool} from "./tool.js"

export const bladeTool = tool("blade", (session) => ({
	pointerdown: ({clip, time}) => {
		if (!clip)
			return

		session.splitClipAt(clip.itemId, time)
		session.canvas.scheduleDraw()
	}
}))

