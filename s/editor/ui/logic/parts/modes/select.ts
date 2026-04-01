
import {tool} from "./tool.js"
import {Dragger} from "../interactions/drag/dragger.js"
import {Roller, cursorForRoll} from "../interactions/roll/roller.js"
import {Trimmer, cursorForTrimEdge} from "../interactions/trim/trimmer.js"
import {TimelineClipBox} from "../../../pages/project/tabbing/tabs/edit/canvas/draw/clip.js"

export const selectTool = tool("select", (session) => {
	const dragger = new Dragger()
	const trimmer = new Trimmer()
	const roller = new Roller()

	const setCursorForPoint = (clip: TimelineClipBox | null, pointerX: number) => {
		const rollEdge = clip ? session.canvas.rollEdgeAt(clip, pointerX) : null
		if (rollEdge)
			session.canvas.canvas.style.cursor = cursorForRoll()
		else {
			const edge = clip ? session.canvas.trimEdgeAt(clip, pointerX) : null
			session.canvas.canvas.style.cursor = cursorForTrimEdge(edge)
		}
	}

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

			if (clip) dragger.start(clip, point, session)
			else dragger.cancel(session)
		},

		pointermove: ({clip, point, time}) => {
			const pointerX = point.x + session.viewport.scrollLeft

			if (roller.isRolling) {
				roller.preview(time, session)
				setCursorForPoint(clip, pointerX)
				return
			}

			if (trimmer.isTrimming)
				return trimmer.preview(time, session)

			if (!dragger.isDragging)
				setCursorForPoint(clip, pointerX)

			dragger.preview(point, session)
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

