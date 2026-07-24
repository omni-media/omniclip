
import {Kind} from "@omnimedia/omnitool"

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

	const parent = canvas.deps.session.index.getItem(intent.parentId)
	if (parent.kind === Kind.Stack) {
		drawHorizontal(canvas, canvas.trackY(intent.index) - 5)
		return
	}

	if (parent.kind === Kind.Sequence) {
		const target = canvas.getBox(parent.childrenIds[intent.index])
		const sibling = target ?? canvas.clips.find(clip => parent.childrenIds.includes(clip.itemId))

		if (sibling)
			drawVertical(canvas, target?.x ?? canvas.endX, sibling.y, sibling.height)
	}

}

