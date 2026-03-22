
import {signal} from '@e280/strata'
import {Id, VideoPlayer} from '@omnimedia/omnitool'
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
import {OmniSession} from '../../../../../../logic/session.js'
import {Strata} from '../../../../../../../context/parts/strata.js'
import {ToolName} from '../../../../../../logic/parts/modes/tool.js'

type EditCanvasDeps = {
	session: OmniSession
	timeline: Strata['timeline']
	settings: Strata['settings']
	player: VideoPlayer
}

type CursorIcon = ToolName

export class TimelineCanvas {
	canvas = document.createElement('canvas')
	ctx = this.canvas.getContext('2d')!

	layout: LayoutResult = {clips: [], rows: 1, duration: ms(0)}

	#raf = 0
	#drawn = Promise.resolve()
	#resolveDrawn: (() => void) | null = null

	$previews = {
		blade: signal<{time: Ms, clipId: Id} | null>(null)
	}

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
			case "select": {
				this.canvas.style.cursor = "default"
				break
			}
			case "blade":
				this.canvas.style.cursor = "url('/assets/icons/material-design-icons/razor.svg') 12 12, crosshair"
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

	get width() {
		const extent = ms(Math.max(
			this.layout.duration,
			this.deps.session.$playhead.value,
			this.viewport.visibleEnd()
		))
		const contentWidth = Math.ceil(this.viewport.durationToWidth(extent)) + metrics.paddingX * 2
		const trailingViewport = this.viewport.width

		return Math.max(
			this.viewport.width,
			contentWidth + trailingViewport
		)
	}

	get height() {
		return metrics.rulerHeight +
			metrics.paddingY * 2 +
			this.layout.rows * metrics.trackHeight +
			Math.max(0, this.layout.rows - 1) * metrics.trackGap
	}

	draw() {
		this.layout = buildLayout(this.deps.session.index, this)
		this.#resize()
		this.clearCanvas()
		drawRuler(this)
		drawLanes(this)
		drawClips(this)
		drawBladePreview(this)
		drawPlayhead(this)
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
		return this.layout.clips.find(
			c => x >= c.x && x <= c.x + c.width && y >= c.y && y <= c.y + c.height
		) ?? null
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

	get timeline(): {rootId: number, items: readonly unknown[]} {
		return this.deps.timeline.state
	}

	#pointerPosition(event: PointerEvent) {
		const rect = this.canvas.getBoundingClientRect()
		return {x: event.clientX - rect.left, y: event.clientY - rect.top}
	}

	#pointerToMs(event: PointerEvent): Ms {
		const {x} = this.#pointerPosition(event)
		return ms(Math.max(0, this.viewport.xToTime(x - metrics.paddingX)))
	}

	pointAt(event: PointerEvent) {
		return this.#pointerPosition(event)
	}

	timeAt(event: PointerEvent): Ms {
		return this.#pointerToMs(event)
	}

	onPointerDown = (event: PointerEvent) => {
		const point = this.#pointerPosition(event)
		const time = this.#pointerToMs(event)
		const inRuler = point.y <= metrics.rulerHeight
		const clip = inRuler ? null : this.clipAt(point.x, point.y)

		this.deps.session.setGhostPlayhead(time)
		this.scheduleDraw()

		this.deps.session.activeMode.value.pointerdown?.({
			event,
			time,
			clip,
			point,
			inRuler
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
			event,
			time,
			clip,
			point,
			inRuler
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
			event,
			time,
			clip,
			point,
			inRuler
		})
	}

	onDoubleClick = (event: MouseEvent) => {
		const point = this.#pointerPosition(event as PointerEvent)
		const inRuler = point.y <= metrics.rulerHeight
		const clip = inRuler ? null : this.clipAt(point.x, point.y)

		this.deps.session.activeMode.value.doubleclick?.({
			event: event as PointerEvent,
			time: this.#pointerToMs(event as PointerEvent),
			clip,
			point,
			inRuler
		})
	}
}
