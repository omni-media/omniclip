
import {signal} from '@e280/strata'
import {ms, Ms} from '@omnimedia/omnitool'

export class Viewport {
	$zoom = signal(1)
	$scrollLeft = signal(0)
	$width = signal(0)
	$height = signal(0)
	$minZoom = signal(0.2)

	constructor(readonly pixelsPerMillisecond: number) {}

	get zoom() {
		return this.$zoom()
	}

	get scrollLeft() {
		return this.$scrollLeft()
	}

	get width() {
		return this.$width()
	}

	get height() {
		return this.$height()
	}

	get minZoom() {
		return this.$minZoom()
	}

	get maxZoom() {
		return 10
	}

	// Time → linear X.
	timeToX(time: Ms) {
		return time * this.pxPerMs()
	}

	timeToViewportX(time: Ms) {
		return this.timeToX(time) - this.scrollLeft
	}

	// Linear X → time.
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

	setSize(width: number, height: number) {
		this.$width(width)
		this.$height(height)
	}

	setMinZoom(minZoom: number) {
		this.$minZoom(minZoom)
		if (this.zoom < minZoom)
			this.setZoom(minZoom)
	}

	setScrollLeft(scrollLeft: number) {
		this.$scrollLeft(Math.max(0, scrollLeft))
	}

	setZoom(zoom: number) {
		const clamped = Math.max(this.minZoom, Math.min(this.maxZoom, zoom))
		this.$zoom(Math.round(clamped * 1000) / 1000)
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

	// Visible linear timeline start.
	visibleStart() {
		return this.xToTime(this.scrollLeft)
	}

	// Visible linear timeline end.
	visibleEnd() {
		return this.xToTime(this.scrollLeft + this.width)
	}

	revealTime(time: Ms, padding = 16) {
		const x = this.timeToX(time)
		if (x < this.scrollLeft + padding)
			this.setScrollLeft(x - padding)
		else if (x > this.scrollLeft + this.width - padding)
			this.setScrollLeft(x - this.width + padding)
	}

	pxPerMs() {
		return this.pixelsPerMillisecond * this.zoom
	}
}

