
import {Kind} from "@omnimedia/omnitool"

import {metrics, styles} from "./styles.js"
import type {TimelineCanvas} from "../canvas.js"
import type {ClipBox} from "../layout/layout.js"

export type TimelineClipBox = ClipBox

function roundedRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	radius: number
) {
	ctx.beginPath()
	ctx.roundRect(x, y, width, height, radius)
}

function itemColor(kind: Kind) {
	switch (kind) {
		case Kind.Video: return "#34527a"
		case Kind.Audio: return "#1b6937"
		case Kind.Image: return "#765c2d"
		case Kind.Text: return "#5c3b91"
		case Kind.Sequence: return "#405160"
		case Kind.Stack: return "#37404b"
		case Kind.Transition: return "#7b4d22"
		case Kind.Gap: return "#292b2f"
		default: return "#555b65"
	}
}

function itemDisabled(canvas: TimelineCanvas, itemId: number) {
	return canvas.deps.session.deps.strata.timeline.state.items
		.find(item => item.id === itemId)
		?.enabled === false
}

function drawLabel(canvas: TimelineCanvas, clip: TimelineClipBox, labelHeight: number, color: string) {
	const ctx = canvas.ctx

	ctx.fillStyle = color
	ctx.fillRect(clip.x, clip.y, clip.width, labelHeight)

	ctx.fillStyle = styles.clipLabelText
	ctx.font = "12px sans-serif"
	ctx.textBaseline = "middle"
	ctx.shadowColor = styles.clipLabelShadow
	ctx.shadowBlur = 2
	ctx.fillText(
		clip.label,
		clip.x + metrics.labelInsetX,
		clip.y + labelHeight / 2 + 0.5
	)
	ctx.shadowBlur = 0
}

function drawOutline(canvas: TimelineCanvas, clip: TimelineClipBox) {
	const ctx = canvas.ctx
	const selected = canvas.selectedItemId() === clip.itemId
	roundedRect(
		ctx,
		clip.x,
		clip.y,
		clip.width,
		clip.height,
		metrics.clipRadius
	)
	ctx.lineWidth = selected ? 2 : 1
	ctx.strokeStyle = selected
		? styles.selectedStroke
		: styles.trackBorder
	ctx.stroke()
}

function drawDisabledOverlay(ctx: CanvasRenderingContext2D, clip: TimelineClipBox) {
	roundedRect(
		ctx,
		clip.x,
		clip.y,
		clip.width,
		clip.height,
		metrics.clipRadius
	)
	ctx.fillStyle = "rgba(12, 12, 12, 0.56)"
	ctx.fill()
}

export function drawClip(canvas: TimelineCanvas, clip: TimelineClipBox) {
	const ctx = canvas.ctx
	const color = itemColor(clip.kind)

	const labelHeight = Math.min(metrics.labelHeight, clip.height)
	const contentBox = {
		...clip,
		y: clip.y + labelHeight,
		height: clip.height - labelHeight,
	}

	roundedRect(
		ctx,
		clip.x,
		clip.y,
		clip.width,
		clip.height,
		metrics.clipRadius
	)
	ctx.fillStyle = color
	ctx.fill()

	ctx.save()
	roundedRect(
		ctx,
		clip.x,
		clip.y,
		clip.width,
		clip.height,
		metrics.clipRadius
	)
	ctx.clip()

	if (clip.kind === Kind.Video)
		canvas.filmstrips.draw(ctx, contentBox)

	if (clip.kind === Kind.Audio)
		canvas.waveforms.draw(ctx, contentBox)

	drawLabel(canvas, clip, labelHeight, color)
	ctx.restore()

	if (itemDisabled(canvas, clip.itemId))
		drawDisabledOverlay(ctx, clip)

	drawOutline(canvas, clip)
}

function drawDragPreview(
	canvas: TimelineCanvas,
	clips: TimelineClipBox[],
	ghost: TimelineClipBox,
) {
	const source = canvas.getBox(ghost.itemId)
	if (!source)
		return

	canvas.ctx.save()
	canvas.ctx.globalAlpha = 0.7
	canvas.ctx.translate(ghost.x - source.x, ghost.y - source.y)
	for (const clip of clips)
		drawClip(canvas, clip)
	canvas.ctx.restore()
}

export function drawClips(canvas: TimelineCanvas) {
	const activeFilmstrips = new Set<number>()
	const activeWaveforms = new Set<number>()
	const ghost = canvas.deps.session.$ghostClip()
	const previewClips: TimelineClipBox[] = []

	for (const clip of canvas.clips) {
		if (clip.kind === Kind.Video)
			activeFilmstrips.add(clip.itemId)
		if (clip.kind === Kind.Audio)
			activeWaveforms.add(clip.itemId)
		if (ghost && canvas.index.contains(ghost.itemId, clip.itemId)) {
			previewClips.push(clip)
			continue
		}
		drawClip(canvas, clip)
	}

	if (ghost)
		drawDragPreview(canvas, previewClips, ghost)

	canvas.filmstrips.retain(activeFilmstrips)
	canvas.waveforms.retain(activeWaveforms)
}

