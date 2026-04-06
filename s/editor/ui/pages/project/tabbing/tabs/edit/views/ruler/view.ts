
import {html} from "lit"
import {dom, view} from "@e280/sly"
import {ms, Ms} from "@omnimedia/omnitool/x/units/ms.js"

import styleCss from "./style.css.js"
import {drawRuler} from "./parts/draw/ruler.js"
import {EditorContext} from "../../../../../../../../context/context.js"

export const Ruler = view(use => (context: EditorContext) => {
	use.styles(styleCss)
	const session = context.session

	const {settings} = context.strata
	const player = context.controllers.player

	const drag = use.once(() => ({
		leftOffset: 0
	}))

	const scheduleDraw = () => {
		requestAnimationFrame(draw)
	}

	const pointerToTime = (e: PointerEvent): Ms => {
		const time = session.viewport.viewportXToTime(e.clientX - drag.leftOffset)

		return ms(Math.max(0, time))
	}

	const updateDrag = (e: PointerEvent) => {
		const time = pointerToTime(e)
		player.seek(time)
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
				session.viewport,
				settings.state
			)
	}

	const canvasPromise = use.wake(() => use.rendered.then(() => {
		const canvas = use.shadow.querySelector(".ruler") as HTMLCanvasElement
		const ctx = canvas?.getContext("2d")
		return {canvas, ctx}
	}))

	use.mount(() => {
		const unScroll = session.viewport.$scrollLeft.on(scheduleDraw)
		const unWidth = session.viewport.$width.on(scheduleDraw)
		const unZoom = session.viewport.$zoom.on(scheduleDraw)
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
			unZoom()
			unSet()
			window.removeEventListener("resize", scheduleDraw)
		}
	})

	return html`
		<canvas class="ruler" @pointerdown=${startDrag}></canvas>
	`
})

