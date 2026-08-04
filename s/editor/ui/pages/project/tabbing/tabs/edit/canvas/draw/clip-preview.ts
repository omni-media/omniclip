
import {drawClip} from "./clip.js"
import type {TimelineCanvas} from "../canvas.js"

export function drawClipPreview(canvas: TimelineCanvas) {
	const clip = canvas.deps.session.$ghostClip.value
	if (!clip)
		return

	canvas.ctx.save()
	canvas.ctx.globalAlpha = 0.7
	drawClip(canvas, clip)
	canvas.ctx.restore()
}
