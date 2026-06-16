
import {html} from "lit"
import {pub} from "@e280/stz"
import {dom, shadow, useCss, useMount, useRendered, useShadow} from "@e280/sly"

import styleCss from "./style.css.js"
import {TimelineScrollbar} from "./scrollbar/view.js"
import themeCss from "../../../../../../../../theme.css.js"
import {EditorContext} from "../../../../../../../../context/context.js"

export const TimelineArea = shadow((context: EditorContext) => {
	useCss(themeCss, styleCss)
	const session = context.session
	const timelineCanvas = context.session.canvas
	const updateScrollbar = pub()

	const shadow = useShadow()
	const timelineElement = () => useRendered()
		.then(() => dom.in(shadow).require(".timeline"))

	let ignoreProgrammaticScroll = false

	const onScroll = async (e: Event) => {
		if (ignoreProgrammaticScroll)
			return

		const element = e.target as HTMLElement
		if (element)
			session.viewport.setScrollLeft(element.scrollLeft)
	}

	useMount(() => {
		const observer = new ResizeObserver(entries => {
			for (const entry of entries) {
				timelineCanvas.resize(entry.contentRect.width)
			}
		})

		const timeline = timelineElement()

		useRendered().then(async () => {
			timelineCanvas.resize((await timeline).clientWidth)
			observer.observe(await timeline)
		})

		const scrollLeft = async (scrollLeft: number) => {
			const element = await timeline
			if (element.scrollLeft === scrollLeft)
				return

			ignoreProgrammaticScroll = true
			element.scrollLeft = scrollLeft
			timelineCanvas.whenDrawn().then(() =>
				element.scrollLeft = scrollLeft
			)

			requestAnimationFrame(() => {
				ignoreProgrammaticScroll = false
			})
		}

		const unsubs = [
			timelineCanvas.drawn.on(updateScrollbar),
			session.viewport.$scrollLeft.on(scrollLeft),
			session.viewport.$scrollLeft.on(timelineCanvas.scheduleDraw),
			session.viewport.$zoom.on(timelineCanvas.scheduleDraw),
			session.$playhead.on(timelineCanvas.scheduleDraw),
			session.$ghostPlayhead.on(timelineCanvas.scheduleDraw),
			session.$selectedItem.on(timelineCanvas.scheduleDraw),
			session.$viewedItemId.on(timelineCanvas.scheduleDraw),
			context.strata.timeline.lens(s => s).on(timelineCanvas.scheduleDraw),
			context.strata.settings.on(timelineCanvas.scheduleDraw),
		]

		const detach = dom.events(timelineCanvas.canvas, {
			pointerdown: timelineCanvas.onPointerDown,
			pointermove: timelineCanvas.onPointerMove,
			pointerup: timelineCanvas.onPointerUp,
			pointerleave: timelineCanvas.onPointerLeave,
			dblclick: timelineCanvas.onDoubleClick
		})

		return () => {
			detach()
			observer.disconnect()
			for (const unsub of unsubs)
				unsub()
		}
	})

	return html`
		<div @scroll=${onScroll} class="timeline">
			${timelineCanvas.canvas}
			${timelineCanvas.spacer}
		</div>
		${TimelineScrollbar(updateScrollbar, timelineElement(), scrollLeft =>
			session.viewport.setScrollLeft(scrollLeft)
		)}
	`
})
