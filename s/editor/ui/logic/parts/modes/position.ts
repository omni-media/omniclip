
import {tool} from "./tool.js"
import {Idx} from "../index.js"
import {Dragger} from "../interactions/drag/dragger.js"

export const positionTool = tool("position", (session) => {
	const dragger = new Dragger(true)

	return {
		pointerdown: ({clip, point}) => {
			const moving = clip && Idx.isClip(clip.kind) ? clip : null
			session.$selectedItem.value = moving?.itemId ?? clip?.itemId ?? null

			if (moving)
				dragger.start(moving, point, session)
			else dragger.cancel(session)
		},

		pointermove: ({point}) => dragger.preview(point, session),
		pointerup: () => dragger.commit(session),
		pointerleave: () => dragger.cancel(session),
	}
})

