
import {ms} from '@omnimedia/omnitool/x/units/ms.js'

import {metrics, styles} from "./styles.js"
import type {TimelineCanvas} from "../canvas.js"
import {formatTime} from "../../../../utils/format-time.js"
import {tickSteps} from "../../views/ruler/parts/constants.js"

const labelY = 12
const labelInsetX = 12
const majorTick = {y: 14, height: 14}
const mediumTick = {y: 22, height: 6}
const minorTick = {y: 24, height: 4}

export function drawRuler(canvas: TimelineCanvas) {
	const pxPerMs = canvas.viewport.durationToWidth(ms(1))
	const trimOffsetPx = canvas.trimPreviewOffsetPx()
	const timebase = canvas.timebase()
	const pps = pxPerMs * 1000
	const steps = tickSteps(timebase)
	const scale = steps.find(step => step.major * pxPerMs >= 80) ?? steps[steps.length - 1]
	const startMs = canvas.visibleStart()
	const endMs = canvas.visibleEnd()
	const startStep = Math.floor(startMs / scale.minor)
	const endStep = Math.ceil(endMs / scale.minor)
	const hasMinorTicks = scale.major === 1000 && (pps / timebase) > 4

	canvas.ctx.fillStyle = styles.rulerBackground
	canvas.ctx.fillRect(0, 0, canvas.width, metrics.rulerHeight)
	canvas.ctx.strokeStyle = styles.rulerBorder
	canvas.ctx.beginPath()
	canvas.ctx.moveTo(0, metrics.rulerHeight - 0.5)
	canvas.ctx.lineTo(canvas.width, metrics.rulerHeight - 0.5)
	canvas.ctx.stroke()

	canvas.ctx.font = "11px sans-serif"
	canvas.ctx.textBaseline = "middle"

	for (let step = startStep; step <= endStep; step += 1) {
		const time = ms(step * scale.minor)
		const x = Math.round(canvas.timeToX(time) - canvas.viewport.scrollLeft + trimOffsetPx)
		const isMajor = Math.round(time) % Math.round(scale.major) === 0

		if (isMajor) {
			canvas.ctx.fillStyle = styles.rulerTick
			canvas.ctx.fillRect(x, majorTick.y, 1, majorTick.height)
			canvas.ctx.fillStyle = styles.rulerLabel
			canvas.ctx.fillText(formatTime(time), x + labelInsetX, labelY)
		}
		else if (scale.major === 1000) {
			const frameNum = Math.round(time / (1000 / timebase))
			if (frameNum % 10 === 0 && (pps * (10 / timebase)) > 10) {
				canvas.ctx.fillStyle = hasMinorTicks
					? styles.rulerTick
					: styles.rulerMinorTick
				canvas.ctx.fillRect(x, mediumTick.y, 1, mediumTick.height)
			}
			else if (hasMinorTicks) {
				canvas.ctx.fillStyle = styles.rulerMinorTick
				canvas.ctx.fillRect(x, minorTick.y, 1, minorTick.height)
			}
		}
		else {
			canvas.ctx.fillStyle = styles.rulerMinorTick
			canvas.ctx.fillRect(x, mediumTick.y, 1, mediumTick.height)
		}
	}
}

