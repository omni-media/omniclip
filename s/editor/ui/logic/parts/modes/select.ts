
import {tool} from "./tool.js"
import {Kind} from "@omnimedia/omnitool"
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
				session.deps.player.seek(time)
				session.setPlayhead(time)
				session.setGhostClip(null)
				session.setDropIntent(null)
				dragger.cancel(session)
				session.canvas.scheduleDraw()
				return
			}

			const pointerX = point.x + session.viewport.scrollLeft

			if (clip) {
				const rollEdge = session.canvas.rollEdgeAt(clip, pointerX)
				if (rollEdge) {
					roller.start(clip, rollEdge, session)
					if (roller.isRolling) {
						session.canvas.canvas.style.cursor = cursorForRoll()
						return
					}
				}

				const edge = session.canvas.trimEdgeAt(clip, pointerX)
				if (edge) {
					trimmer.start(clip, edge, session)
					session.canvas.canvas.style.cursor = cursorForTrimEdge(edge)
					return
				}
			}

			session.$selectedItem.value = clip?.itemId ?? null
			session.canvas.scheduleDraw()

			if (clip && clip.kind !== Kind.Transition) dragger.start(clip, point, session)
			else dragger.cancel(session)
		},

		pointermove: ({clip, point, time}) => {
			if (roller.isRolling) return roller.preview(time, session)
			if (trimmer.isTrimming) return trimmer.preview(time, session)

			dragger.preview(point, session)

			if (!dragger.isDragging) {
				const pointerX = point.x + session.viewport.scrollLeft
				const rollEdge = clip ? session.canvas.rollEdgeAt(clip, pointerX) : null
				const trimEdge = clip ? session.canvas.trimEdgeAt(clip, pointerX) : null

				session.canvas.canvas.style.cursor = rollEdge
					? cursorForRoll()
					: cursorForTrimEdge(trimEdge)
			}
		},

		pointerup: () => {
			if (roller.isRolling) {
				roller.commit(session)
				return
			}

			if (trimmer.isTrimming) {
				trimmer.commit(session)
				return
			}

			dragger.commit(session)
		},

		pointerleave: () => {
			roller.cancel(session)
			trimmer.cancel(session)
			dragger.cancel(session)
			session.canvas.canvas.style.cursor = "default"
		},

		doubleclick: ({clip}) => {
			if (!clip?.enterable) return
			session.$viewedItemId.value = clip.itemId
			session.$selectedItem.value = clip.itemId
			session.canvas.scheduleDraw()
		}
	}
})

