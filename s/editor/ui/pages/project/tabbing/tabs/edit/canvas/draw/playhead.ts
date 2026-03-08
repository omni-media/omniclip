
import {metrics, styles} from "./styles.js"
import type {TimelineCanvas} from "../canvas.js"

export function drawPlayhead(canvas: TimelineCanvas) {
	const x = canvas.playheadX() + metrics.paddingX

	canvas.ctx.strokeStyle = styles.playhead
	canvas.ctx.lineWidth = 2
	canvas.ctx.beginPath()
	canvas.ctx.moveTo(x, 0)
	canvas.ctx.lineTo(x, canvas.height)
	canvas.ctx.stroke()
}
