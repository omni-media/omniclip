
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
		case Kind.Audio:
			return styles.audioFill
		case Kind.Text:
			return styles.textFill
		default:
			return styles.unknownFill
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

export function drawClip(canvas: TimelineCanvas, clip: TimelineClipBox) {
	const ctx = canvas.ctx

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

	if (clip.kind === Kind.Video)
		canvas.filmstrips.draw(ctx, clip)

	if (clip.kind === Kind.Audio)
		canvas.waveforms.draw(ctx, clip)

	ctx.lineWidth = clip.selected ? 2 : 1
	ctx.strokeStyle = clip.selected
		? styles.selectedStroke
		: styles.trackBorder
	ctx.stroke()

	ctx.fillStyle = styles.text
	ctx.font = "12px sans-serif"
	ctx.textBaseline = "middle"
	ctx.fillText(
		clip.enterable ? `${clip.label} ->` : clip.label,
		clip.x + metrics.labelInsetX,
		clip.y + clip.height / 2
	)
}

export function drawClips(canvas: TimelineCanvas) {
	const activeFilmstrips = new Set<number>()
	const activeWaveforms = new Set<number>()
	const ghostClip = canvas.deps.session.$ghostClip.value

	for (const clip of canvas.layout.clips) {
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

