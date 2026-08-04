
import {styles} from "./styles.js"
import type {TimelineCanvas} from "../canvas.js"

export function drawSnapTargets(canvas: TimelineCanvas) {
	const drop = canvas.deps.session.$drop.value
	if (!drop)
		return
	const {indicator} = drop

	const {ctx} = canvas
	ctx.strokeStyle = styles.selectedStroke
	ctx.lineWidth = 2
	if (indicator.width && indicator.height) {
		ctx.strokeRect(indicator.x, indicator.y, indicator.width, indicator.height)
		return
	}

	ctx.beginPath()
	ctx.moveTo(indicator.x, indicator.y)
	ctx.lineTo(indicator.x + indicator.width, indicator.y + indicator.height)
	ctx.stroke()
}

