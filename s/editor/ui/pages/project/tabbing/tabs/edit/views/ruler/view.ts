
import {html} from "lit"
import {view} from "@e280/sly"
import {debounce} from "@e280/stz"

import styleCss from "./style.css.js"
import {drawRuler} from "./parts/draw/ruler.js"
import {PIXELS_PER_MILLISECOND} from "../../constants.js"
import {EditorContext} from "../../../../../../../../context/context.js"

export const Ruler = view(use => (context: EditorContext) => {
	use.styles(styleCss)

	const {settings, ui} = context.strata
	const player = context.controllers.player

	const throttledSeek = use.once(() => debounce(50, time => player.seek(time)))
	const mem = use.once(() => ({
		dragLeft: 0,
		rafId: 0,
		grid: null as HTMLElement | null,
		render: () => {}
	}))

	const scheduleRender = () => {
		if (mem.rafId) return
		mem.rafId = requestAnimationFrame(() => {
			mem.rafId = 0
			mem.render()
		})
	}

	const seek = (e: PointerEvent) => {
		const scrollX = mem.grid?.scrollLeft ?? ui.state.timelineScrollLeft
		const ms = Math.max(0, (e.clientX - mem.dragLeft + scrollX) / (PIXELS_PER_MILLISECOND * settings.state.zoom))
		throttledSeek(ms)
		player.currentTime.value = ms
	}

	const handleUp = () => {
		window.removeEventListener("pointermove", seek)
		window.removeEventListener("pointerup", handleUp)
	}

	const handleDown = (e: PointerEvent) => {
		mem.dragLeft = use.shadow.querySelector(".ruler")?.getBoundingClientRect().left ?? 0
		seek(e)
		window.addEventListener("pointermove", seek)
		window.addEventListener("pointerup", handleUp)
	}

	use.mount(() => {
		let disposed = false
		mem.grid = use.element.closest(".timeline-grid")

		const unUi = ui.on(scheduleRender)
		const unSet = settings.on(scheduleRender)

		mem.grid?.addEventListener("scroll", scheduleRender, {passive: true})
		window.addEventListener("resize", scheduleRender, {passive: true})

		;(async () => {
			await use.rendered
			if (disposed) return

			const canvas = use.shadow.querySelector(".ruler") as HTMLCanvasElement
			const ctx = canvas?.getContext("2d")
			if (!ctx) return

			mem.render = () => drawRuler(ctx, canvas, mem.grid, ui, settings)
			mem.render()
		})()

		return () => {
			disposed = true
			mem.grid?.removeEventListener("scroll", scheduleRender)
			window.removeEventListener("resize", scheduleRender)
			window.removeEventListener("pointermove", seek)
			window.removeEventListener("pointerup", handleUp)
			unUi()
			unSet()
			cancelAnimationFrame(mem.rafId)
		}
	})

	return html`
		<canvas
			class="ruler"
			style="display: block; position: sticky; left: 0; height: 32px; cursor: ew-resize;"
			@pointerdown=${handleDown}
		></canvas>`
})

