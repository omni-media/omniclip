import {metrics, styles} from "./styles.js"
import type {TimelineCanvas} from "../canvas.js"

export function drawBladePreview(canvas: TimelineCanvas) {

	const blade = () => {
		const preview = canvas.deps.session.$previews.blade.value
		if (preview === null)
			return null

		const clip = canvas.layout.clips.find(c => c.itemId === preview.clipId)
		if (!clip)
			return null

		return {
			x: preview.time * canvas.pxPerMs() + metrics.paddingX,
			clip
		}
	}

	const preview = blade()
	if (preview === null)
		return

	canvas.ctx.strokeStyle = styles.bladePreview
	canvas.ctx.lineWidth = 1
	canvas.ctx.beginPath()
	canvas.ctx.moveTo(preview.x, preview.clip.y)
	canvas.ctx.lineTo(preview.x, preview.clip.y + preview.clip.height)
	canvas.ctx.stroke()
}
