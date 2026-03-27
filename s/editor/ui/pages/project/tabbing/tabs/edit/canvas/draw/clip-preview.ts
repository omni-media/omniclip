
import {drawClip} from "./clip.js"
import type {TimelineCanvas} from "../canvas.js"

export function drawClipPreview(canvas: TimelineCanvas) {
	const clip = canvas.deps.session.$ghostClip.value
	if (!clip)
		return

	drawClip(canvas, clip)
}
