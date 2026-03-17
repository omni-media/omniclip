
import {signal} from '@e280/strata'
import {ms, Ms} from '@omnimedia/omnitool/x/units/ms.js'

export class Viewport {
	$zoom = signal(1)
	$scrollLeft = signal(0)
	$width = signal(0)

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

	setZoom(zoom: number) {
		const clamped = Math.max(0.2, Math.min(10, zoom))
		this.$zoom.value = Math.round(clamped * 10) / 10
	}

	adjustZoom(delta: number) {
		this.setZoom(this.zoom + delta)
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
