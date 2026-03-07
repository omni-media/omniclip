
import {html} from "lit"
import {dom, view} from "@e280/sly"
import {debounce} from "@e280/stz"
import {ms} from "@omnimedia/omnitool/x/units/ms.js"

import styleCss from "./style.css.js"
import {drawRuler} from "./parts/draw/ruler.js"
import {PIXELS_PER_MILLISECOND} from "../../constants.js"
import {EditorContext} from "../../../../../../../../context/context.js"

export const Ruler = view(use => (context: EditorContext) => {
	use.styles(styleCss)
	const session = context.session

	const {settings} = context.strata
	const player = context.controllers.player

	const throttledSeek = use.once(() =>
		debounce(16, time => player.seek(time))
	)

	const drag = use.once(() => ({
		leftOffset: 0
	}))

	const scheduleDraw = () => {
		requestAnimationFrame(draw)
	}

	const pointerToTime = (e: PointerEvent) => {
		const scrollLeft = session.$timeline.scrollLeft.value

		const relativeX = e.clientX - drag.leftOffset + scrollLeft
		const zoom = session.$zoom.value
		const ms = relativeX / (PIXELS_PER_MILLISECOND * zoom)

		return Math.max(0, ms)
	}

	const updateDrag = (e: PointerEvent) => {
		const time = pointerToTime(e)
		throttledSeek(time)
		session.setPlayhead(ms(time))
	}

	const startDrag = (e: PointerEvent) => {
		const canvas = e.target as HTMLCanvasElement
		drag.leftOffset = canvas.getBoundingClientRect().left
		updateDrag(e)
		const detach = dom.events(window, {
	  	pointermove: updateDrag,
	  	pointerup: () => detach(),
		})
	}

	async function draw() {
		const {canvas, ctx} = await canvasPromise
		if(ctx)
			drawRuler(
				ctx,
				canvas,
				session.$timeline.scrollLeft.value,
				session.$timeline.width.value,
				session.$zoom.value,
				settings.state
			)
	}

	const canvasPromise = use.wake(() => use.rendered.then(() => {
		const canvas = use.shadow.querySelector(".ruler") as HTMLCanvasElement
		const ctx = canvas?.getContext("2d")
		return {canvas, ctx}
	}))

	use.mount(() => {
		const unScroll = session.$timeline.scrollLeft.on(scheduleDraw)
		const unWidth = session.$timeline.width.on(scheduleDraw)
		const unSet = settings.on(scheduleDraw)

		window.addEventListener(
			"resize",
			scheduleDraw,
			{passive: true}
		)

		use.rendered.then(draw)

		return () => {
			unScroll()
			unWidth()
			unSet()
			window.removeEventListener("resize", scheduleDraw)
		}
	})

	return html`
		<canvas class="ruler" @pointerdown=${startDrag}></canvas>
	`
})

