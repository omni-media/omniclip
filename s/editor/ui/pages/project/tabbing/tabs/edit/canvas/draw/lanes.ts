
import type {TimelineCanvas} from "../canvas.js"
import {metrics, styles} from "./styles.js"

export function drawLanes(canvas: TimelineCanvas) {
	for (let row = 0; row < canvas.layout.rows; row += 1) {
		const y = canvas.trackY(row)
		const bandY = y - metrics.trackGap / 2
		const bandHeight = metrics.trackHeight + metrics.trackGap
		const borderY = bandY + bandHeight - 0.5

		canvas.ctx.fillStyle = row % 2 === 0
			? styles.trackBackground
			: styles.trackBackgroundAlt
		canvas.ctx.fillRect(0, bandY, canvas.width, bandHeight)
		canvas.ctx.strokeStyle = styles.trackBorder
		canvas.ctx.beginPath()
		canvas.ctx.moveTo(0, borderY)
		canvas.ctx.lineTo(canvas.width, borderY)
		canvas.ctx.stroke()
	}
}

