
import {html} from "lit"
import {dom, view} from "@e280/sly"
import {debounce} from "@e280/stz"

import styleCss from "./style.css.js"
import {drawRuler} from "./parts/draw/ruler.js"
import {PIXELS_PER_MILLISECOND} from "../../constants.js"
import {EditorContext} from "../../../../../../../../context/context.js"

export const Ruler = view(use => (context: EditorContext) => {
	use.styles(styleCss)

	const {settings, ui} = context.strata
	const player = context.controllers.player

	const throttledSeek = use.once(() =>
		debounce(50, time => player.seek(time))
	)

	const drag = use.once(() => ({
		leftOffset: 0
	}))

	const scheduleDraw = () => requestAnimationFrame(draw)

	const pointerToTime = (e: PointerEvent) => {
		const scrollLeft = ui.state.timelineScrollLeft

		const relativeX = e.clientX - drag.leftOffset + scrollLeft
		const zoom = settings.state.zoom
		const ms = relativeX / (PIXELS_PER_MILLISECOND * zoom)

		return Math.max(0, ms)
	}

	const updateDrag = (e: PointerEvent) => {
		const time = pointerToTime(e)
		throttledSeek(time)
		player.currentTime.value = time
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
			drawRuler(ctx, canvas, ui.state, settings.state)
	}

	const canvasPromise = use.wake(() => use.rendered.then(() => {
		const canvas = use.shadow.querySelector(".ruler") as HTMLCanvasElement
		const ctx = canvas?.getContext("2d")
		return {canvas, ctx}
	}))

	use.mount(() => {
		const unUi = ui.on(scheduleDraw)
		const unSet = settings.on(scheduleDraw)

		window.addEventListener(
			"resize",
			scheduleDraw,
			{passive: true}
		)

		use.rendered.then(draw)

		return () => {
			unUi()
			unSet()
			window.removeEventListener("resize", scheduleDraw)
		}
	})

	return html`
		<canvas class="ruler" @pointerdown=${startDrag}></canvas>
	`
})

