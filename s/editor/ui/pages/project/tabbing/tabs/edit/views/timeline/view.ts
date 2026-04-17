
import {html} from "lit"
import {dom, shadow, useCss, useMount, useRendered, useShadow} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../../../../../../../../theme.css.js"
import {EditorContext} from "../../../../../../../../context/context.js"

export const TimelineArea = shadow((context: EditorContext) => {
	useCss(themeCss, styleCss)
	const session = context.session
	const timelineCanvas = context.session.canvas

	const shadow = useShadow()

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

		const timeline = useRendered().then(() => dom.in(shadow).require(".timeline"))

		useRendered().then(async () => {
			timelineCanvas.resize((await timeline).clientWidth)
			observer.observe(await timeline)
		})

		const scrollLeft = async (scrollLeft: number) => {
			const element = await timeline
			if (element.scrollLeft === scrollLeft)
				return

			ignoreProgrammaticScroll = true
			await timelineCanvas.whenDrawn()
			element.scrollLeft = scrollLeft

			requestAnimationFrame(() => {
				ignoreProgrammaticScroll = false
			})
		}

		const unsubs = [
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
	`
})
