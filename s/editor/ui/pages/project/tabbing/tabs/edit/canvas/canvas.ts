
import {VideoPlayer} from '@omnimedia/omnitool'
import {ms, Ms} from '@omnimedia/omnitool/x/units/ms.js'

import {drawRuler} from './draw/ruler.js'
import {drawLanes} from './draw/lanes.js'
import {buildLayout} from './layout/build.js'
import {LayoutResult} from './layout/types.js'
import {drawPlayhead} from './draw/playhead.js'
import {metrics, styles} from './draw/styles.js'
import {PIXELS_PER_MILLISECOND} from '../constants.js'
import {drawClips, TimelineClipBox} from './draw/clip.js'
import {OmniSession} from '../../../../../../logic/session.js'
import {Strata} from '../../../../../../../context/parts/strata.js'

type EditCanvasDeps = {
	session: OmniSession
	timeline: Strata['timeline']
	settings: Strata['settings']
	player: VideoPlayer
}

export class TimelineCanvas {
	canvas = document.createElement('canvas')

	ctx: CanvasRenderingContext2D
	layout: LayoutResult = {clips: [], rows: 1, duration: 0}
	width = 0
	height = 0
	#clipBoxes: TimelineClipBox[] = []
	#viewportWidth = 0
	#raf = 0

	constructor(private deps: EditCanvasDeps) {
		this.ctx = this.canvas.getContext('2d')!
		if (!this.ctx) throw new Error('Canvas 2D not supported')

		this.canvas.className = 'timeline-canvas'
		this.canvas.addEventListener('pointerdown', this.#onPointerDown)
		this.canvas.addEventListener('click', this.#onClick)
		this.canvas.addEventListener('dblclick', this.#onDoubleClick)
	}

	dispose() {
		this.canvas.removeEventListener('pointerdown', this.#onPointerDown)
		this.canvas.removeEventListener('click', this.#onClick)
		this.canvas.removeEventListener('dblclick', this.#onDoubleClick)
		if (this.#raf) cancelAnimationFrame(this.#raf)
	}

	setViewportWidth(width: number) {
		this.#viewportWidth = width
		this.scheduleDraw()
	}

	scheduleDraw = () => {
		if (this.#raf) return
		this.#raf = requestAnimationFrame(() => {
			this.#raf = 0
			this.draw()
		})
	}

	draw() {
		this.layout = buildLayout(this)
		this.#clipBoxes = this.layout.clips

		this.width = Math.max(
			this.#viewportWidth,
			Math.ceil(this.layout.duration * this.pxPerMs()) + metrics.paddingX * 2
		)
		this.height =
			metrics.rulerHeight +
			metrics.paddingY * 2 +
			this.layout.rows * metrics.trackHeight +
			Math.max(0, this.layout.rows - 1) * metrics.trackGap

		this.#resizeCanvas(this.width, this.height)
		this.ctx.clearRect(0, 0, this.width, this.height)

		this.ctx.fillStyle = styles.background
		this.ctx.fillRect(0, 0, this.width, this.height)

		drawRuler(this)
		drawLanes(this)
		drawClips(this)
		drawPlayhead(this)
	}

	clipAt(x: number, y: number) {
		return this.#clipBoxes.find(
			c => x >= c.x && x <= c.x + c.width && y >= c.y && y <= c.y + c.height
		) ?? null
	}

	#resizeCanvas(width: number, height: number) {
		const ratio = window.devicePixelRatio || 1
		this.canvas.width = Math.round(width * ratio)
		this.canvas.height = Math.round(height * ratio)
		this.canvas.style.width = `${width}px`
		this.canvas.style.height = `${height}px`
		this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
	}

	trackY = (row: number) => {
		return metrics.rulerHeight + metrics.paddingY +
			   row * (metrics.trackHeight + metrics.trackGap)
	}

	pxPerMs() {
		return PIXELS_PER_MILLISECOND * this.deps.session.$zoom.value
	}
	selectedItemId() {
		return this.deps.session.$selectedItem.value
	}
	viewedItemId() {
		return this.deps.session.$viewedItemId.value
	}
	timebase() {
		return this.deps.settings.state.timebase
	}
	playheadX() {
		return this.deps.session.$playhead.value
	}
	get timeline(): {rootId: number, items: readonly unknown[]} {
		return this.deps.timeline.state.timeline
	}

	#pointerPosition(event: PointerEvent) {
		const rect = this.canvas.getBoundingClientRect()
		return { x: event.clientX - rect.left, y: event.clientY - rect.top }
	}

	#pointerToMs(event: PointerEvent): Ms {
		const {x} = this.#pointerPosition(event)
		return ms(Math.max(0, (x - metrics.paddingX) / this.pxPerMs()))
	}

	#onPointerDown = (event: PointerEvent) => {
		if (this.#pointerPosition(event).y > metrics.rulerHeight) return

		const seek = (e: PointerEvent) => {
			const time = this.#pointerToMs(e)
			this.deps.player.seek(time)
			this.deps.session.setPlayhead(time)
			this.scheduleDraw()
		}

		const up = () => {
			window.removeEventListener('pointermove', seek)
			window.removeEventListener('pointerup', up)
		}

		seek(event)
		window.addEventListener('pointermove', seek)
		window.addEventListener('pointerup', up)
	}

	#onClick = (event: MouseEvent) => {
		const point = this.#pointerPosition(event as PointerEvent)
		if (point.y <= metrics.rulerHeight) return

		const clip = this.clipAt(point.x, point.y)
		this.deps.session.$selectedItem.value = clip?.itemId ?? null
		this.scheduleDraw()
	}

	#onDoubleClick = (event: MouseEvent) => {
		const point = this.#pointerPosition(event as PointerEvent)
		const clip = this.clipAt(point.x, point.y)

		if (!clip?.enterable) return

		this.deps.session.$viewedItemId.value = clip.itemId
		this.deps.session.$selectedItem.value = clip.itemId
		this.scheduleDraw()
	}
}

