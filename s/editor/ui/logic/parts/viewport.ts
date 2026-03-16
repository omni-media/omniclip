
import {ms, Ms} from '@omnimedia/omnitool/x/units/ms.js'

export class Viewport {
	width = 0

	constructor(readonly getZoom: () => number) {}

	timeToX(time: Ms) {
		return time * this.getZoom()
	}

	xToTime(x: number) {
		return ms(x / this.getZoom())
	}

	durationToWidth(duration: Ms) {
		return duration * this.getZoom()
	}

	widthToDuration(width: number) {
		return ms(width / this.getZoom())
	}

	setWidth(width: number) {
		this.width = width
	}

	visibleStart() {
		return ms(0)
	}

	visibleEnd() {
		return this.widthToDuration(this.width)
	}
}
