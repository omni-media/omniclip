
import {styles} from "./styles.js"
import type {TimelineCanvas} from "../canvas.js"

function drawIndicator(canvas: TimelineCanvas, indicator: {x: number, y: number, width: number, height: number}) {
	const {ctx} = canvas
	if (indicator.width && indicator.height) {
		ctx.strokeRect(indicator.x, indicator.y, indicator.width, indicator.height)
		return
	}

	ctx.beginPath()
	ctx.moveTo(indicator.x, indicator.y)
	ctx.lineTo(indicator.x + indicator.width, indicator.y + indicator.height)
	ctx.stroke()
}

export function drawSnapTargets(canvas: TimelineCanvas) {
	const {ctx} = canvas
	const externalDrag = canvas.dragDrop.dragging

	if (externalDrag) {
		ctx.save()
		ctx.strokeStyle = styles.dropTarget
		ctx.globalAlpha = 0.8
		ctx.lineWidth = 2
		for (const {indicator} of externalDrag.targets)
			drawIndicator(canvas, indicator)
		ctx.restore()
	}

	const drop = canvas.deps.session.$drop.value
	if (drop) {
		ctx.save()
		ctx.strokeStyle = externalDrag
			? styles.dropTargetActive
			: styles.selectedStroke
		ctx.lineWidth = externalDrag ? 4 : 2
		if (externalDrag) {
			ctx.shadowColor = styles.dropTarget
			ctx.shadowBlur = 6
		}
		drawIndicator(canvas, drop.indicator)
		ctx.restore()
	}
}

