
import {dom} from '@e280/sly'
import {signal} from '@e280/strata'
import {Driver, Id, Item, Kind, Resource, VideoPlayer} from '@omnimedia/omnitool'
import {fps, Fps} from '@omnimedia/omnitool/x/units/fps.js'
import {ms, Ms} from '@omnimedia/omnitool/x/units/ms.js'

import {drawClips} from './draw/clip.js'
import {drawRuler} from './draw/ruler.js'
import {drawLanes} from './draw/lanes.js'
import {buildLayout} from './layout/build.js'
import {LayoutResult} from './layout/types.js'
import {drawPlayhead} from './draw/playhead.js'
import {metrics, styles} from './draw/styles.js'
import {drawBladePreview} from './draw/blade-preview.js'
import {drawClipPreview} from './draw/clip-preview.js'
import {drawSnapTargets} from './draw/snap-targets.js'
import {TimelineClipBox} from './draw/clip.js'
import {TimelineFilmstrips} from './parts/filmstrips.js'
import {TimelineWaveforms} from './parts/waveforms.js'
import {OmniSession} from '../../../../../../logic/session.js'
import {Strata} from '../../../../../../../context/parts/strata.js'
import {ToolName} from '../../../../../../logic/parts/modes/tool.js'

type EditCanvasDeps = {
	session: OmniSession
	timeline: Strata['timeline']
	settings: Strata['settings']
	player: VideoPlayer
	driver: Driver
	resolveMedia: (item: Item.Any) => Resource.Media | null
}

type CursorIcon = ToolName

export class TimelineCanvas {
	canvas = document.createElement('canvas')
	ctx = this.canvas.getContext('2d')!

	spacer = dom.elmer("div").attr("className", "spacer").done()

	layout: LayoutResult = {clips: [], rows: 1, duration: ms(0)}
	#contentExtent = ms(0)
	#lastZoom = 0

	#raf = 0
	#drawn = Promise.resolve()
	#resolveDrawn: (() => void) | null = null

	$previews = {
		blade: signal<{time: Ms, clipId: Id} | null>(null)
	}

	filmstrips = new TimelineFilmstrips(this)
	waveforms = new TimelineWaveforms(this)

	constructor(public deps: EditCanvasDeps) {}

	get viewport() {
		return this.deps.session.viewport
	}

	resize(width: number) {
		this.viewport.setWidth(width)
		this.scheduleDraw()
	}

	clearPreviews() {
		for(const preview in this.$previews) {
			this.$previews[preview as keyof typeof this.$previews].value = null
		}
	}

	switchCursor(cursor: CursorIcon) {
		switch(cursor) {
			case "select":
				this.canvas.style.cursor = "default"
				break
			case "blade":
				this.canvas.style.cursor = "url('/assets/icons/material-design-icons/razor.svg') 12 12, crosshair"
				break
			case "position":
				this.canvas.style.cursor = "grab"
				break
			case "trim":
				this.canvas.style.cursor = "ew-resize"
				break
			case "zoom":
				this.canvas.style.cursor = "zoom-in"
				break
		}
	}

	scheduleDraw = () => {
		if (!this.#resolveDrawn) {
			this.#drawn = new Promise(resolve => {
				this.#resolveDrawn = resolve
			})
		}

		if (!this.#raf) {
			this.#raf = requestAnimationFrame(this.#flushDraw)
		}
	}

	whenDrawn = () => this.#drawn

	#flushDraw = () => {
		this.#raf = 0
		const resolve = this.#resolveDrawn
		this.#resolveDrawn = null
		this.draw()
		resolve?.()
	}

	get contentWidth() {
		const stableExtent = ms(Math.max(
			this.layout.duration,
			this.deps.session.$playhead.value,
		))

		if (this.viewport.zoom !== this.#lastZoom) {
			this.#contentExtent = ms(Math.max(stableExtent, this.viewport.visibleEnd()))
			this.#lastZoom = this.viewport.zoom
		} else {
			this.#contentExtent = ms(Math.max(this.#contentExtent, stableExtent))
		}

		const contentPx = Math.ceil(this.viewport.durationToWidth(this.#contentExtent)) + metrics.paddingX * 2
		return Math.max(this.viewport.width, contentPx + this.viewport.width)
	}

	get width() {
		return this.viewport.width
	}

	get height() {
		return metrics.rulerHeight +
			metrics.paddingY * 2 +
			this.layout.rows * metrics.trackHeight +
			Math.max(0, this.layout.rows - 1) * metrics.trackGap
	}

	draw() {
		this.layout = buildLayout(this.deps.session.index, this)
		this.spacer.style.width = `${this.contentWidth}px`
		this.#resize()
		this.clearCanvas()

		drawRuler(this)
		drawLanes(this)

		this.ctx.save()
		this.ctx.translate(-this.viewport.scrollLeft, 0)
		this.ctx.translate(this.trimPreviewOffsetPx(), 0)
		drawClips(this)
		drawClipPreview(this)
		drawSnapTargets(this)
		drawBladePreview(this)
		drawPlayhead(this)
		this.ctx.restore()
	}

	#resize() {
		const ratio = window.devicePixelRatio || 1
		this.canvas.width = Math.round(this.width * ratio)
		this.canvas.height = Math.round(this.height * ratio)
		this.canvas.style.width = `${this.width}px`
		this.canvas.style.height = `${this.height}px`
		this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
	}

	clipAt(x: number, y: number) {
		x += this.viewport.scrollLeft - this.trimPreviewOffsetPx()
		return this.layout.clips.find(
			c => c.kind !== Kind.Gap &&
				x >= c.x && x <= c.x + c.width && y >= c.y && y <= c.y + c.height
		) ?? null
	}

	getBox(itemId: Id) {
		return this.layout.clips.find(clip => clip.itemId === itemId) ?? null
	}

	getInsertIndex(parentId: Id, movingId: Id, pointerX: number) {
		const parent = this.deps.session.index.getItem(parentId)
		if (!("childrenIds" in parent))
			return 0

		const siblings = parent.childrenIds
			.filter(id => id !== movingId)
			.map(id => this.getBox(id))
			.filter(box => !!box)

		return siblings.filter(box => pointerX >= box.x + box.width / 2).length
	}

	trimEdgeAt(clip: TimelineClipBox, canvasX: number) {
		return canvasX - clip.x <= 10
			? "start"
			: clip.x + clip.width - canvasX <= 10
				? "end"
				: null
	}

	rollEdgeAt(clip: TimelineClipBox, canvasX: number) {
		if (clip.kind === Kind.Transition)
			return null

		const parent = this.deps.session.index.getParent(clip.itemId)
		if (!parent || parent.kind !== Kind.Sequence)
			return null

		const index = parent.childrenIds.indexOf(clip.itemId)
		if (index === -1)
			return null

		const inStartZone = canvasX - clip.x <= 6
		const inEndZone = clip.x + clip.width - canvasX <= 6
		const prev = this.deps.session.index.getItemMaybe(parent.childrenIds[index - 1])
		const next = this.deps.session.index.getItemMaybe(parent.childrenIds[index + 1])

		if (inStartZone && index > 0 && prev?.kind !== Kind.Transition)
			return "start"
		if (inEndZone && index < parent.childrenIds.length - 1 && next?.kind !== Kind.Transition)
			return "end"
		return null
	}

	clampClipToCanvasBounds(clip: TimelineClipBox, x: number, y: number) {
		return {
			...clip,
			x: Math.max(0, Math.min(this.contentWidth - clip.width, x)),
			y: Math.max(
				metrics.rulerHeight + metrics.paddingY,
				Math.min(this.height - metrics.paddingY - clip.height, y),
			),
		}
	}

	clearCanvas() {
		this.ctx.clearRect(0, 0, this.width, this.height)
		this.ctx.fillStyle = styles.background
		this.ctx.fillRect(0, 0, this.width, this.height)
	}

	trackY = (row: number) => {
		return metrics.rulerHeight + metrics.paddingY +
			row * (metrics.trackHeight + metrics.trackGap)
	}

	rowAt(y: number) {
		const local = y - metrics.rulerHeight - metrics.paddingY
		if (local <= 0)
			return 0

		const row = Math.floor(local / (metrics.trackHeight + metrics.trackGap))
		return Math.max(0, Math.min(this.layout.rows - 1, row))
	}

	selectedItemId() {
		return this.deps.session.$selectedItem.value
	}

	viewedItemId() {
		return this.deps.session.$viewedItemId.value
	}

	timebase(): Fps {
		return fps(Number(this.deps.settings.state.timebase))
	}

	playheadX() {
		return this.viewport.timeToX(this.deps.session.$playhead.value)
	}

	ghostPlayheadX() {
		const time = this.deps.session.$ghostPlayhead.value
		return time === null ? null : this.viewport.timeToX(time)
	}

	trimPreviewOffsetPx() {
		return this.deps.session.$trimPreviewOffsetPx.value
	}

	get timeline(): {rootId: number, items: readonly unknown[]} {
		return this.deps.timeline.state
	}

	#pointerPosition(event: PointerEvent) {
		const rect = this.canvas.getBoundingClientRect()
		return {x: event.clientX - rect.left, y: event.clientY - rect.top}
	}

	#pointerToMs(event: PointerEvent): Ms {
		const {x} = this.#pointerPosition(event)
		return ms(Math.max(0, this.viewport.viewportXToTime(x - metrics.paddingX)))
	}

	pointAt(event: PointerEvent) {
		return this.#pointerPosition(event)
	}

	timeAt(event: PointerEvent): Ms {
		return this.#pointerToMs(event)
	}

	onPointerDown = (event: PointerEvent) => {
		this.canvas.setPointerCapture(event.pointerId)
		const point = this.#pointerPosition(event)
		const time = this.#pointerToMs(event)
		const inRuler = point.y <= metrics.rulerHeight
		const clip = inRuler ? null : this.clipAt(point.x, point.y)

		this.deps.session.setGhostPlayhead(time)
		this.scheduleDraw()

		this.deps.session.activeMode.value.pointerdown?.({
			event, time, clip, point, inRuler
		})
	}

	onPointerMove = (event: PointerEvent) => {
		const point = this.#pointerPosition(event)
		const time = this.#pointerToMs(event)
		const inRuler = point.y <= metrics.rulerHeight
		const clip = inRuler ? null : this.clipAt(point.x, point.y)

		this.deps.session.setGhostPlayhead(time)
		this.scheduleDraw()

		this.deps.session.activeMode.value.pointermove?.({
			event, time, clip, point, inRuler
		})
	}

	onPointerUp = (event: PointerEvent) => {
		if (this.canvas.hasPointerCapture(event.pointerId))
			this.canvas.releasePointerCapture(event.pointerId)

		const point = this.#pointerPosition(event)
		const time = this.#pointerToMs(event)
		const inRuler = point.y <= metrics.rulerHeight
		const clip = inRuler ? null : this.clipAt(point.x, point.y)

		this.deps.session.activeMode.value.pointerup?.({
			event, time, clip, point, inRuler
		})
	}

	onPointerLeave = (event: PointerEvent) => {
		const point = this.#pointerPosition(event)
		const time = this.#pointerToMs(event)
		const inRuler = point.y <= metrics.rulerHeight
		const clip = inRuler ? null : this.clipAt(point.x, point.y)

		this.deps.session.clearGhostPlayhead()
		this.scheduleDraw()

		this.deps.session.activeMode.value.pointerleave?.({
			event, time, clip, point, inRuler
		})
	}

	onDoubleClick = (event: MouseEvent) => {
		const point = this.#pointerPosition(event as PointerEvent)
		const inRuler = point.y <= metrics.rulerHeight
		const clip = inRuler ? null : this.clipAt(point.x, point.y)

		this.deps.session.activeMode.value.doubleclick?.({
			event: event as PointerEvent,
			time: this.#pointerToMs(event as PointerEvent),
			clip, point, inRuler
		})
	}
}
