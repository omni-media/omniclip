
import {ms} from '@omnimedia/omnitool/x/units/ms.js'
import {fps} from '@omnimedia/omnitool/x/units/fps.js'

import {tickSteps} from "../constants.js"
import {drawMajorTick} from "./major-tick.js"
import {drawMinorTick} from "./minor-tick.js"
import {Viewport} from "../../../../../../../../../logic/parts/viewport.js"
import {Settings} from '../../../../../../../../../../context/parts/strata.js'

export function drawRuler (
	ctx: CanvasRenderingContext2D,
	canvas: HTMLCanvasElement,
	viewport: Viewport,
	settings: Settings
) {
	const {timebase} = settings
	const width = Math.max(1, Math.round(viewport.width || canvas.clientWidth || window.innerWidth))

	if (canvas.width !== width || canvas.height !== 32) {
		canvas.width = width
		canvas.height = 32
		canvas.style.width = `${width}px`
		ctx.font = "12px sans-serif"
	}

	ctx.clearRect(0, 0, width, 32)

	const pxPerMs = viewport.durationToWidth(ms(1))
	const pps = pxPerMs * 1000

	const steps = tickSteps(fps(timebase))
	const scale = steps.find(s => s.major * pxPerMs >= 80) || steps[steps.length - 1]

	const startMs = viewport.visibleStart()
	const endMs = viewport.visibleEnd()

	const startStep = Math.floor(startMs / scale.minor)
	const endStep = Math.ceil(endMs / scale.minor)

	for (let step = startStep; step <= endStep; step++) {
		const time = ms(step * scale.minor)
		const x = Math.round(viewport.timeToViewportX(time))
		const isMajor = Math.round(time) % Math.round(scale.major) === 0

		if (isMajor) {
			drawMajorTick(ctx, x, time)
		} else {
			drawMinorTick(ctx, x, time, scale.major, fps(timebase), pps)
		}
	}
}

