
import {Kind} from "@omnimedia/omnitool"
import {Item} from "@omnimedia/omnitool"

import {styles} from "./styles.js"
import type {TimelineCanvas} from "../canvas.js"

function drawVertical(canvas: TimelineCanvas, x: number, y: number, height: number) {
	canvas.ctx.strokeStyle = styles.selectedStroke
	canvas.ctx.lineWidth = 2
	canvas.ctx.beginPath()
	canvas.ctx.moveTo(x, y)
	canvas.ctx.lineTo(x, y + height)
	canvas.ctx.stroke()
}

function drawHorizontal(canvas: TimelineCanvas, y: number) {
	canvas.ctx.strokeStyle = styles.selectedStroke
	canvas.ctx.lineWidth = 2
	canvas.ctx.beginPath()
	canvas.ctx.moveTo(0, y)
	canvas.ctx.lineTo(canvas.contentWidth, y)
	canvas.ctx.stroke()
}

export function drawSnapTargets(canvas: TimelineCanvas) {
	const preview = canvas.deps.session.$dropIntent.value
	if (!preview)
		return

	const {intent} = preview

	switch (intent.type) {
		case "sequence-reorder":
		case "sequence-insert": {
			const sequence = canvas.deps.session.index.getItem<Item.Sequence>(intent.sequenceId)
			const targetId = sequence.childrenIds[intent.index]
			const targetBox = targetId == null ? null : canvas.getBox(targetId)
			const x = targetBox ? targetBox.x : Math.max(0, ...canvas.layout.clips.map(clip => clip.x + clip.width))
			const row = targetBox?.y ?? canvas.layout.clips.find(clip => sequence.childrenIds.includes(clip.itemId))?.y
			const height = targetBox?.height ?? canvas.layout.clips.find(clip => sequence.childrenIds.includes(clip.itemId))?.height
			if (row != null && height != null)
				drawVertical(canvas, x, row, height)
			return
		}

		case "stack": {
			const row = canvas.trackY(intent.index)
			drawHorizontal(canvas, row - 5)
			return
		}

		case "stack-wrap-leaf": {
			const target = canvas.deps.session.index.getItem(intent.targetId)
			if (target.kind !== Kind.Sequence) {
				const box = canvas.getBox(target.id)
				if (box) {
					drawVertical(canvas, intent.before ? box.x : box.x + box.width, box.y, box.height)
				}
			}
		}
	}
}
