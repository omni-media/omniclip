
import {dom} from '@e280/sly'
import {VideoPlayer} from '@omnimedia/omnitool'
import {ms, Ms} from '@omnimedia/omnitool/x/units/ms.js'

import {drawClips} from './draw/clip.js'
import {drawRuler} from './draw/ruler.js'
import {drawLanes} from './draw/lanes.js'
import {buildLayout} from './layout/build.js'
import {LayoutResult} from './layout/types.js'
import {drawPlayhead} from './draw/playhead.js'
import {metrics, styles} from './draw/styles.js'
import {PIXELS_PER_MILLISECOND} from '../constants.js'
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
	ctx = this.canvas.getContext("2d")!

	layout: LayoutResult = {clips: [], rows: 1, duration: 0}

	#viewportWidth = 0
	#raf = 0

	constructor(private deps: EditCanvasDeps) {}

	resize(width: number) {
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

	get width() {
		return Math.max(
			this.#viewportWidth,
			Math.ceil(this.layout.duration * this.pxPerMs()) + metrics.paddingX * 2
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
		return this.deps.session.$playhead.value * this.pxPerMs()
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
		return ms(Math.max(0, (x - metrics.paddingX) / this.pxPerMs()))
	}

	onPointerDown = (event: PointerEvent) => {
		if (this.#pointerPosition(event).y > metrics.rulerHeight) return

		const seek = (e: PointerEvent) => {
			const time = this.#pointerToMs(e)
			this.deps.player.seek(time)
			this.deps.session.setPlayhead(time)
			this.scheduleDraw()
		}

		seek(event)

		const detach = dom.events(window, {
			pointermove: seek,
			pointerup: () => detach()
		})
	}

	onClick = (event: MouseEvent) => {
		const point = this.#pointerPosition(event as PointerEvent)
		if (point.y <= metrics.rulerHeight) return

		const clip = this.clipAt(point.x, point.y)
		this.deps.session.$selectedItem.value = clip?.itemId ?? null
		this.scheduleDraw()
	}

	onDoubleClick = (event: MouseEvent) => {
		const point = this.#pointerPosition(event as PointerEvent)
		const clip = this.clipAt(point.x, point.y)

		if (!clip?.enterable) return

		this.deps.session.$viewedItemId.value = clip.itemId
		this.deps.session.$selectedItem.value = clip.itemId
		this.scheduleDraw()
	}
}
