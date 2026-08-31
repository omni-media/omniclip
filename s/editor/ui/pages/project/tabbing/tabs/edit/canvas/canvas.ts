
import {dom} from '@e280/sly'
import {pub} from '@e280/stz'
import {signal} from '@e280/strata'
import {fps, Fps} from '@omnimedia/omnitool/x/units/fps.js'
import {ms, Ms} from '@omnimedia/omnitool/x/units/ms.js'
import {Driver, Id, Item, Kind, Resource, VideoPlayer} from '@omnimedia/omnitool'

import {drawClips} from './draw/clip.js'
import {drawRuler} from './draw/ruler.js'
import {TimelineClipBox} from './draw/clip.js'
import {drawPlayhead} from './draw/playhead.js'
import {layout, type ClipBox} from './layout/layout.js'
import {metrics, styles} from './draw/styles.js'
import {drawBladePreview} from './draw/blade-preview.js'
import {drawSnapTargets} from './draw/snap-targets.js'
import {TimelineFilmstrips} from './parts/filmstrips.js'
import {TimelineWaveforms} from './parts/waveforms.js'
import {CanvasDragDrop} from './parts/drag_drop.js'
import {Idx} from '../../../../../../logic/parts/index.js'
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
	drawn = pub()

	spacer = dom.elmer("div").attr("className", "spacer").done()

	clips: ClipBox[] = []
	#contentExtent = ms(0)
	#lastZoom = 0

	#raf = 0

	$previews = {
		blade: signal<{time: Ms, clipId: Id} | null>(null)
	}
	dragDrop = new CanvasDragDrop(this)

	filmstrips = new TimelineFilmstrips(this)
	waveforms = new TimelineWaveforms(this)

	constructor(public deps: EditCanvasDeps) {}

	get viewport() {
		return this.deps.session.viewport
	}

	get index() {
		return this.deps.session.index
	}

	/** visual size of an item on the timeline */
	itemSize(item: Item.Any) {
		return {
			height: metrics.trackHeight,
			width: this.viewport.durationToWidth(this.index.getItemDuration(item.id))
		}
	}

	resize(width: number, height: number) {
		this.viewport.setSize(width, height)
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
				this.canvas.style.cursor = "move"
				break
			case "hand":
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
		if (!this.#raf) {
			this.#raf = requestAnimationFrame(this.#flushDraw)
		}
	}

	#flushDraw = () => {
		this.#raf = 0
		this.draw()
		this.drawn()
	}

	get contentWidth() {
		const stableExtent = ms(Math.max(
			this.duration,
			this.deps.session.$playhead.value,
		))

		if (this.viewport.zoom !== this.#lastZoom) {
			this.#contentExtent = ms(Math.max(stableExtent, this.viewport.visibleEnd()))
			this.#lastZoom = this.viewport.zoom
		} else {
			this.#contentExtent = ms(Math.max(this.#contentExtent, stableExtent))
		}

		const timedContentPx = Math.ceil(this.viewport.durationToWidth(this.#contentExtent))
		return Math.max(this.viewport.width, timedContentPx + this.viewport.width)
	}

	get endY() {
		return Math.max(...this.clips.map(clip => clip.y + clip.height))
	}

	get duration() {
		return this.deps.session.index.getItemDuration(this.getViewedItem().id)
	}

	get width() {
		return this.viewport.width
	}

	get height() {
		const contentHeight = this.endY + metrics.paddingY
		return Math.max(contentHeight, this.viewport.height)
	}

	draw() {
		this.clips = layout(this)
		this.spacer.style.width = `${this.contentWidth}px`
		this.#resize()
		this.clearCanvas()

		drawRuler(this)
		this.ctx.save()
		this.ctx.translate(-this.viewport.scrollLeft, 0)
		this.ctx.translate(this.trimPreviewOffsetPx(), 0)
		drawClips(this)
		drawBladePreview(this)
		drawPlayhead(this)
		drawSnapTargets(this)
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
		return this.clips.findLast(
			c => x >= c.x && x <= c.x + c.width && y >= c.y && y <= c.y + c.height
		) ?? null
	}

	getBox(itemId?: Id) {
		return itemId == null
			? null
			: this.clips.find(clip => clip.itemId === itemId) ?? null
	}

	trimEdgeAt(clip: TimelineClipBox, canvasX: number) {
		return canvasX - clip.x <= 10
			? "start"
			: clip.x + clip.width - canvasX <= 10
				? "end"
				: null
	}

	rollEdgeAt(clip: TimelineClipBox, canvasX: number) {
		if (Idx.isTransitionKind(clip.kind))
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

		if (inStartZone && index > 0 && !Idx.isTransitionKind(prev?.kind))
			return "start"
		if (inEndZone && index < parent.childrenIds.length - 1 && !Idx.isTransitionKind(next?.kind))
			return "end"
		return null
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

	selectedItemId() {
		return this.deps.session.$selectedItem.value
	}

	getViewedItem() {
		return this.deps.session.index.getItem<Idx.Struct>(this.deps.session.$viewedItemId.value)
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

	#pointerPosition(event: MouseEvent) {
		const rect = this.canvas.getBoundingClientRect()
		return {x: event.clientX - rect.left, y: event.clientY - rect.top}
	}

	#pointerToMs(event: MouseEvent): Ms {
		const {x} = this.#pointerPosition(event)
		return ms(Math.max(0, this.viewport.xToTime(
			x + this.viewport.scrollLeft - this.trimPreviewOffsetPx()
		)))
	}

	pointAt(event: MouseEvent) {
		return this.#pointerPosition(event)
	}

	timeAt(event: MouseEvent): Ms {
		return this.#pointerToMs(event)
	}

	onPointerDown = (event: PointerEvent) => {
		if (event.button !== 0)
			return

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
