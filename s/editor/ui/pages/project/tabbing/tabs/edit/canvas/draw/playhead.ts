
import {metrics, styles} from "./styles.js"
import type {TimelineCanvas} from "../canvas.js"

const headHeight = 13
const headBottomGap = 1

function drawLine(
	canvas: TimelineCanvas,
	x: number,
	color: string,
	lineWidth: number,
	startY = 0
) {
	canvas.ctx.strokeStyle = color
	canvas.ctx.lineWidth = lineWidth
	canvas.ctx.beginPath()
	canvas.ctx.moveTo(x, startY)
	canvas.ctx.lineTo(x, canvas.height)
	canvas.ctx.stroke()
}

function drawHead(canvas: TimelineCanvas, x: number) {
	const y = metrics.rulerHeight - headHeight - headBottomGap
	const width = 10
	const height = headHeight
	const radius = 2
	const left = x - width / 2
	const right = x + width / 2
	const shoulderY = y + height - 4

	canvas.ctx.strokeStyle = styles.playhead
	canvas.ctx.lineWidth = 1.5
	canvas.ctx.beginPath()
	canvas.ctx.moveTo(left + radius, y)
	canvas.ctx.lineTo(right - radius, y)
	canvas.ctx.quadraticCurveTo(right, y, right, y + radius)
	canvas.ctx.lineTo(right, shoulderY - radius)
	canvas.ctx.quadraticCurveTo(right, shoulderY, right - radius, shoulderY)
	canvas.ctx.lineTo(x, y + height)
	canvas.ctx.lineTo(left + radius, shoulderY)
	canvas.ctx.quadraticCurveTo(left, shoulderY, left, shoulderY - radius)
	canvas.ctx.lineTo(left, y + radius)
	canvas.ctx.quadraticCurveTo(left, y, left + radius, y)
	canvas.ctx.closePath()
	canvas.ctx.stroke()
}

export function drawPlayhead(canvas: TimelineCanvas) {
	const ghostX = canvas.ghostPlayheadX()
	const trimOffsetPx = canvas.trimPreviewOffsetPx()

	if (ghostX !== null)
		drawLine(canvas, ghostX + metrics.paddingX - trimOffsetPx, styles.ghostPlayhead, 1)

	const x = canvas.playheadX() + metrics.paddingX
	drawLine(canvas, x, styles.playhead, 2, metrics.rulerHeight - headBottomGap - 1)
	drawHead(canvas, x)
}

