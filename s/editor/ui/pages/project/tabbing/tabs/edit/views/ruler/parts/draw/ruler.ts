
import {ms} from '@omnimedia/omnitool/x/units/ms.js'

import {tickSteps} from "../constants.js"
import {drawMajorTick} from "./major-tick.js"
import {drawMinorTick} from "./minor-tick.js"
import {PIXELS_PER_MILLISECOND} from "../../../../constants.js"
import {EditorSettingsState} from "../../../../../../../../../../context/parts/strata.js"

export function drawRuler (
	ctx: CanvasRenderingContext2D,
	canvas: HTMLCanvasElement,
	timelineScrollLeft: number,
	timelineWidth: number,
	zoom: number,
	settings: EditorSettingsState
) {
	const {timebase} = settings
	const scrollX = timelineScrollLeft
	const width = Math.max(1, Math.round(timelineWidth || canvas.clientWidth || window.innerWidth))

	if (canvas.width !== width || canvas.height !== 32) {
		canvas.width = width
		canvas.height = 32
		canvas.style.width = `${width}px`
		ctx.font = "12px sans-serif"
	}

	ctx.clearRect(0, 0, width, 32)

	const pxPerMs = PIXELS_PER_MILLISECOND * zoom
	const pps = pxPerMs * 1000

	const steps = tickSteps(timebase)
	const scale = steps.find(s => s.major * pxPerMs >= 80) || steps[steps.length - 1]

	const startMs = ms(Math.max(0, scrollX / pxPerMs))
	const endMs = ms((scrollX + width) / pxPerMs)

	const startStep = Math.floor(startMs / scale.minor)
	const endStep = Math.ceil(endMs / scale.minor)

	for (let step = startStep; step <= endStep; step++) {
		const time = ms(step * scale.minor)
		const x = Math.round(time * pxPerMs - scrollX)
		const isMajor = Math.round(time) % Math.round(scale.major) === 0

		if (isMajor) {
			drawMajorTick(ctx, x, time)
		} else {
			drawMinorTick(ctx, x, time, scale.major, timebase, pps)
		}
	}
}

