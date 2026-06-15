
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

function clipFill(kind: Kind) {
	switch (kind) {
		case Kind.Stack:
			return styles.stackFill
		case Kind.Video:
			return styles.videoFill
		case Kind.Image:
			return styles.imageFill
		case Kind.Audio:
			return styles.audioFill
		case Kind.Text:
			return styles.textFill
		case Kind.Caption:
			return styles.captionFill
		case Kind.Transition:
			return styles.transitionFill
		default:
			return styles.unknownFill
	}
}

function labelFill(kind: Kind) {
	switch (kind) {
		case Kind.Video:
		case Kind.Image:
			return styles.videoLabelFill
		case Kind.Audio:
			return styles.audioLabelFill
		case Kind.Text:
		case Kind.Caption:
			return styles.textLabelFill
		default:
			return clipFill(kind)
	}
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

function drawLabel(ctx: CanvasRenderingContext2D, clip: TimelineClipBox, labelHeight: number) {
	ctx.fillStyle = labelFill(clip.kind)
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
	ctx.fillStyle = clipFill(clip.kind)
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

	drawLabel(ctx, clip, labelHeight)
	ctx.restore()

	drawOutline(ctx, clip)
}

export function drawClips(canvas: TimelineCanvas) {
	const activeFilmstrips = new Set<number>()
	const activeWaveforms = new Set<number>()
	const ghostClip = canvas.deps.session.$ghostClip.value

	for (const clip of canvas.layout.clips) {
		if (clip.kind === Kind.Gap)
			continue
		if (clip.itemId === ghostClip?.itemId)
			continue
		if (clip.kind === Kind.Video)
			activeFilmstrips.add(clip.itemId)
		if (clip.kind === Kind.Audio)
			activeWaveforms.add(clip.itemId)
		drawClip(canvas, clip)
	}

	canvas.filmstrips.retain(activeFilmstrips)
	canvas.waveforms.retain(activeWaveforms)
}

