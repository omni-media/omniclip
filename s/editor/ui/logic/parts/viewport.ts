
import {signal} from '@e280/strata'
import {ms, Ms} from '@omnimedia/omnitool/x/units/ms.js'

export class Viewport {
	$zoom = signal(1)
	$scrollLeft = signal(0)
	$width = signal(0)
	$minZoom = signal(0.2)

	constructor(readonly pixelsPerMillisecond: number) {}

	get zoom() {
		return this.$zoom.value
	}

	get scrollLeft() {
		return this.$scrollLeft.value
	}

	get width() {
		return this.$width.value
	}

	get minZoom() {
		return this.$minZoom.value
	}

	get maxZoom() {
		return 10
	}

	timeToX(time: Ms) {
		return time * this.pxPerMs()
	}

	timeToViewportX(time: Ms) {
		return this.timeToX(time) - this.scrollLeft
	}

	xToTime(x: number) {
		return ms(x / this.pxPerMs())
	}

	viewportXToTime(x: number) {
		return this.xToTime(x + this.scrollLeft)
	}

	durationToWidth(duration: Ms) {
		return duration * this.pxPerMs()
	}

	widthToDuration(width: number) {
		return ms(width / this.pxPerMs())
	}

	setWidth(width: number) {
		this.$width.value = width
	}

	setMinZoom(minZoom: number) {
		this.$minZoom.value = minZoom
		if (this.zoom < minZoom)
			this.setZoom(minZoom)
	}

	setScrollLeft(scrollLeft: number) {
		this.$scrollLeft.value = Math.max(0, scrollLeft)
	}

	setZoom(zoom: number) {
		const clamped = Math.max(this.minZoom, Math.min(this.maxZoom, zoom))
		this.$zoom.value = Math.round(clamped * 1000) / 1000
	}

	adjustZoom(delta: number) {
		this.setZoom(this.zoom + delta)
	}

	setZoomAt(viewportX: number, zoom: number) {
		const anchorX = Math.max(0, viewportX)
		const anchorTime = this.viewportXToTime(anchorX)
		const previousZoom = this.zoom

		this.setZoom(zoom)

		if (this.zoom === previousZoom)
			return

		this.setScrollLeft(this.timeToX(anchorTime) - anchorX)
	}

	adjustZoomAt(viewportX: number, delta: number) {
		this.setZoomAt(viewportX, this.zoom + delta)
	}

	visibleStart() {
		return this.xToTime(this.scrollLeft)
	}

	visibleEnd() {
		return this.xToTime(this.scrollLeft + this.width)
	}

	pxPerMs() {
		return this.pixelsPerMillisecond * this.zoom
	}
}

