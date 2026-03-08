
import {metrics, styles} from "./styles.js"
import type {TimelineCanvas} from "../canvas.js"
import {formatTime} from "../../../../utils/format-time.js"
import {tickSteps} from "../../views/ruler/parts/constants.js"

export function drawRuler(canvas: TimelineCanvas) {
	const pxPerMs = canvas.pxPerMs()
	const timebase = canvas.timebase()
	const pps = pxPerMs * 1000
	const steps = tickSteps(timebase)
	const scale = steps.find(step => step.major * pxPerMs >= 80) ?? steps[steps.length - 1]
	const endMs = Math.max(0, (canvas.width - (metrics.paddingX * 2)) / pxPerMs)
	const endStep = Math.ceil(endMs / scale.minor)

	canvas.ctx.fillStyle = styles.rulerBackground
	canvas.ctx.fillRect(0, 0, canvas.width, metrics.rulerHeight)
	canvas.ctx.strokeStyle = styles.rulerBorder
	canvas.ctx.beginPath()
	canvas.ctx.moveTo(0, metrics.rulerHeight - 0.5)
	canvas.ctx.lineTo(canvas.width, metrics.rulerHeight - 0.5)
	canvas.ctx.stroke()

	canvas.ctx.font = "12px sans-serif"
	canvas.ctx.textBaseline = "top"

	for (let step = 0; step <= endStep; step += 1) {
		const time = step * scale.minor
		const x = Math.round((time * pxPerMs) + metrics.paddingX)
		const isMajor = Math.round(time) % Math.round(scale.major) === 0

		if (isMajor) {
			canvas.ctx.fillStyle = styles.rulerTick
			canvas.ctx.fillRect(x, 0, 1, metrics.rulerHeight)
			canvas.ctx.fillStyle = styles.rulerLabel
			canvas.ctx.fillText(formatTime(time), x + 4, 6)
		}
		else if (scale.major === 1000) {
			const frameNum = Math.round(time / (1000 / timebase))
			if (frameNum % 10 === 0 && (pps * (10 / timebase)) > 10) {
				canvas.ctx.fillStyle = styles.rulerTick
				canvas.ctx.fillRect(x, 16, 1, 16)
			}
			else if ((pps / timebase) > 4) {
				canvas.ctx.fillStyle = styles.rulerMinorTick
				canvas.ctx.fillRect(x, 24, 1, 8)
			}
		}
		else {
			canvas.ctx.fillStyle = styles.rulerTick
			canvas.ctx.fillRect(x, 16, 1, 16)
		}
	}
}

