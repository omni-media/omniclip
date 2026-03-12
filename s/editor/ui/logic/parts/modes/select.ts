
import {dom} from "@e280/sly"

import {tool} from "./tool.js"

export const selectTool = tool("select", (session) => ({
	pointerdown: ({clip, inRuler, time}) => {
		if (inRuler) {
			session.deps.player.seek(time)
			session.setPlayhead(time)
			session.canvas.scheduleDraw()

			const detach = dom.events(window, {
				pointermove: (e: PointerEvent) => {
					const time = session.canvas.timeAt(e)
					session.deps.player.seek(time)
					session.setPlayhead(time)
					session.canvas.scheduleDraw()
				},
				pointerup: () => detach()
			})

			return
		}

		session.$selectedItem.value = clip?.itemId ?? null
		session.canvas.scheduleDraw()
	},

	doubleclick: ({clip}) => {
		if (!clip?.enterable)
			return

		session.$viewedItemId.value = clip.itemId
		session.$selectedItem.value = clip.itemId
		session.canvas.scheduleDraw()
	}
}))
