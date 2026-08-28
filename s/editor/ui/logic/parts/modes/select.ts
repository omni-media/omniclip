
import {tool} from "./tool.js"
import {Idx} from "../index.js"
import {Dragger} from "../interactions/drag/dragger.js"
import {Roller, cursorForRoll} from "../interactions/roll/roller.js"
import {Trimmer, cursorForTrimEdge} from "../interactions/trim/trimmer.js"

export const selectTool = tool("select", (session) => {
	const dragger = new Dragger()
	const trimmer = new Trimmer()
	const roller = new Roller()
	let scrubbing = false

	return {
		pointerdown: ({clip, inRuler, time, point, event}) => {
			if (inRuler) {
				scrubbing = true
				session.seekPlayhead(time)
				dragger.cancel(session)
				return
			}

			if (clip && !event.ctrlKey) {
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

			let moving = clip && Idx.isClip(clip.kind) ? clip : null
			if (event.ctrlKey && clip) {
				const containerId = Idx.isStructKind(clip.kind)
					? clip.itemId
					: session.index.getParent(clip.itemId)?.id
				moving = session.canvas.getBox(containerId)
			}

			session.$selectedItem.value = moving?.itemId ?? clip?.itemId ?? null

			if (moving)
				dragger.start(moving, point, session)
			else dragger.cancel(session)
		},

		pointermove: ({clip, point, time}) => {
			if (scrubbing) {
				session.seekPlayhead(time)
				return
			}

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
			if (scrubbing) {
				scrubbing = false
				return
			}

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

