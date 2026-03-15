
import {tool} from "./tool.js"

export const bladeTool = tool("blade", (session) => ({
	pointerdown: ({clip, time}) => {
		if (!clip)
			return

		session.splitClipAt(clip.itemId, time)
		session.canvas.scheduleDraw()
	},
	pointermove: ({clip, inRuler, time}) => {
		session.$previews.blade.value = !inRuler && clip
			? {time, clipId: clip.itemId}
			: null
		session.canvas.scheduleDraw()
	},
	pointerleave: () => {
		session.$previews.blade.value = null
		session.canvas.scheduleDraw()
	},
}))
