
import {Kind} from "@omnimedia/omnitool"

import {tool} from "./tool.js"
import {Idx} from "../index.js"
import {Dragger} from "../interactions/drag/dragger.js"
import {Roller, cursorForRoll} from "../interactions/roll/roller.js"
import {Trimmer, cursorForTrimEdge} from "../interactions/trim/trimmer.js"

export const selectTool = tool("select", (session) => {
	const dragger = new Dragger()
	const trimmer = new Trimmer()
	const roller = new Roller()

	return {
		pointerdown: ({clip, inRuler, time, point}) => {
			if (inRuler) {
				session.playback.seek(time)
				session.setPlayhead(time)
				dragger.cancel(session)
				return
			}

			if (clip) {
				const pointerX = point.x + session.viewport.scrollLeft
				const rollEdge = session.canvas.rollEdgeAt(clip, pointerX)
				if (rollEdge && roller.start(clip, rollEdge, session)) {
					session.canvas.canvas.style.cursor = cursorForRoll()
					return
				}

				const edge = session.canvas.trimEdgeAt(clip, pointerX)
				if (edge) {
					trimmer.start(clip, edge, session)
					session.canvas.canvas.style.cursor = cursorForTrimEdge(edge)
					return
				}
			}

			const moving = clip && clip.kind !== Kind.Transition && !Idx.isStructKind(clip.kind)
				? clip
				: null

			session.$selectedItem.value = clip?.itemId ?? null

			if (moving)
				dragger.start(moving, point, session)
			else dragger.cancel(session)
		},

		pointermove: ({clip, point, time}) => {
			if (roller.isRolling) return roller.preview(time, session)
			if (trimmer.isTrimming) return trimmer.preview(time, session)

			dragger.preview(point, session)

			if (dragger.isDragging)
				return

			const pointerX = point.x + session.viewport.scrollLeft
			const rollEdge = clip ? session.canvas.rollEdgeAt(clip, pointerX) : null
			const trimEdge = clip ? session.canvas.trimEdgeAt(clip, pointerX) : null
			session.canvas.canvas.style.cursor = rollEdge
				? cursorForRoll()
				: cursorForTrimEdge(trimEdge)
		},

		pointerup: () => {
			if (roller.isRolling) return roller.commit(session)
			if (trimmer.isTrimming) return trimmer.commit(session)

			dragger.commit(session)
		},

		pointerleave: () => {
			roller.cancel(session)
			trimmer.cancel(session)
			dragger.cancel(session)
			session.canvas.canvas.style.cursor = "default"
		},

		doubleclick: ({clip}) => {
			if (!clip)
				return

			const item = session.index.getItem(clip.itemId)
			const container = Idx.isStruct(item) ? item : session.index.getParent(item.id)

			if (!container || container.id === session.$viewedItemId())
				return

			session.$viewedItemId(container.id)
			session.$selectedItem(container.id)
		}
	}
})

