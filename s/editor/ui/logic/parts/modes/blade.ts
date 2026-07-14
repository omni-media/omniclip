
import {tool} from "./tool.js"

export const bladeTool = tool("blade", (session) => ({
	pointerdown: ({clip, time}) => {
		if (!clip)
			return

		session.splitClipAt(clip.itemId, time)
	},
	pointermove: ({clip, inRuler, time}) => {
		session.canvas.$previews.blade.value = !inRuler && clip
			? {time, clipId: clip.itemId}
			: null
		session.canvas.scheduleDraw()
	},
	pointerleave: () => {
		session.canvas.$previews.blade.value = null
		session.canvas.scheduleDraw()
	},
}))
