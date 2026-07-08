
import {Kind} from "@omnimedia/omnitool"

import {metrics, styles} from "./styles.js"
import type {TimelineCanvas} from "../canvas.js"

export type TimelineClipBox = {
	itemId: number
	kind: Kind
	label: string
	x: number
	y: number
	width: number
	height: number
	selected: boolean
	enterable: boolean
}

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

function roleColor(canvas: TimelineCanvas, itemId: number) {
	const outliner = canvas.deps.session.deps.strata.outliner.state
	const item = outliner.items.find(item => item.itemId === itemId)
	return canvas.deps.session.roles.lookup.require(item!.roleId).color
}

function itemDisabled(canvas: TimelineCanvas, itemId: number) {
	return canvas.deps.session.deps.strata.timeline.state.items
		.find(item => item.id === itemId)
		?.enabled === false
}

function drawLabel(canvas: TimelineCanvas, clip: TimelineClipBox, labelHeight: number) {
	const ctx = canvas.ctx

	ctx.fillStyle = roleColor(canvas, clip.itemId)
	ctx.fillRect(clip.x, clip.y, clip.width, labelHeight)

	ctx.fillStyle = styles.clipLabelText
	ctx.font = "12px sans-serif"
	ctx.textBaseline = "middle"
	ctx.shadowColor = styles.clipLabelShadow
	ctx.shadowBlur = 2
	ctx.fillText(
		clip.enterable ? `${clip.label} ->` : clip.label,
		clip.x + metrics.labelInsetX,
		clip.y + labelHeight / 2 + 0.5
	)
	ctx.shadowBlur = 0
}

function drawOutline(ctx: CanvasRenderingContext2D, clip: TimelineClipBox) {
	roundedRect(
		ctx,
		clip.x,
		clip.y,
		clip.width,
		clip.height,
		metrics.clipRadius
	)
	ctx.lineWidth = clip.selected ? 2 : 1
	ctx.strokeStyle = clip.selected
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
	ctx.fillStyle = roleColor(canvas, clip.itemId)
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

	drawLabel(canvas, clip, labelHeight)
	ctx.restore()

	if (itemDisabled(canvas, clip.itemId))
		drawDisabledOverlay(ctx, clip)

	drawOutline(ctx, clip)
}

export function drawClips(canvas: TimelineCanvas) {
	const activeFilmstrips = new Set<number>()
	const activeWaveforms = new Set<number>()
	const ghostClip = canvas.deps.session.$ghostClip.value

	for (const clip of canvas.layout.clips) {
		if (clip.kind === Kind.Gap)
			continue
		if (clip.kind === Kind.Video)
			activeFilmstrips.add(clip.itemId)
		if (clip.kind === Kind.Audio)
			activeWaveforms.add(clip.itemId)
		if (clip.itemId === ghostClip?.itemId)
			continue
		drawClip(canvas, clip)
	}

	canvas.filmstrips.retain(activeFilmstrips)
	canvas.waveforms.retain(activeWaveforms)
}

