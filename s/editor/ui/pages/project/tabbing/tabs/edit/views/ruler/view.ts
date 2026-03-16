
import {html} from "lit"
import {dom, view} from "@e280/sly"
import {debounce} from "@e280/stz"
import {fps} from "@omnimedia/omnitool/x/units/fps.js"
import {ms, Ms} from "@omnimedia/omnitool/x/units/ms.js"

import styleCss from "./style.css.js"
import {drawRuler} from "./parts/draw/ruler.js"
import {EditorContext} from "../../../../../../../../context/context.js"

export const Ruler = view(use => (context: EditorContext) => {
	use.styles(styleCss)
	const session = context.session

	const {settings} = context.strata
	const player = context.controllers.player

	const throttledSeek = use.once(() =>
		debounce(16, (time: Ms) => player.seek(time))
	)

	const drag = use.once(() => ({
		leftOffset: 0
	}))

	const scheduleDraw = () => {
		requestAnimationFrame(draw)
	}

	const pointerToTime = (e: PointerEvent): Ms => {
		const scrollLeft = session.$timeline.scrollLeft.value

		const relativeX = e.clientX - drag.leftOffset + scrollLeft
		const time = session.viewport.xToTime(relativeX)

		return ms(Math.max(0, time))
	}

	const updateDrag = (e: PointerEvent) => {
		const time = pointerToTime(e)
		throttledSeek(time)
		session.setPlayhead(time)
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
				{...settings.state, timebase: fps(Number(settings.state.timebase))}
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

