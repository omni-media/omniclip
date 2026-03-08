
import type {TimelineCanvas} from "../canvas.js"
import {metrics, styles} from "./styles.js"

export function drawLanes(canvas: TimelineCanvas) {
	for (let row = 0; row < canvas.layout.rows; row += 1) {
		const y = canvas.trackY(row)
		canvas.ctx.fillStyle = styles.trackBackground
		canvas.ctx.fillRect(0, y, canvas.width, metrics.trackHeight)
		canvas.ctx.strokeStyle = styles.trackBorder
		canvas.ctx.strokeRect(0, y, canvas.width, metrics.trackHeight)
	}
}

