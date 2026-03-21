
import {metrics, styles} from "./styles.js"
import type {TimelineCanvas} from "../canvas.js"

function drawLine(
	canvas: TimelineCanvas,
	x: number,
	color: string,
	lineWidth: number,
	dash: number[] = []
) {
	canvas.ctx.strokeStyle = color
	canvas.ctx.lineWidth = lineWidth
	canvas.ctx.setLineDash(dash)
	canvas.ctx.beginPath()
	canvas.ctx.moveTo(x, 0)
	canvas.ctx.lineTo(x, canvas.height)
	canvas.ctx.stroke()
	canvas.ctx.setLineDash([])
}

export function drawPlayhead(canvas: TimelineCanvas) {
	const ghostX = canvas.ghostPlayheadX()

	if (ghostX !== null)
		drawLine(canvas, ghostX + metrics.paddingX, styles.ghostPlayhead, 1)

	drawLine(canvas, canvas.playheadX() + metrics.paddingX, styles.playhead, 2)
}
