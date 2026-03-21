
import {html} from "lit"
import {dom, view} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../../../../../../../../theme.css.js"
import {EditorContext} from "../../../../../../../../context/context.js"

export const TimelineArea = view(use => (context: EditorContext) => {
	use.styles(themeCss, styleCss)
	const session = context.session
	const timelineCanvas = context.session.canvas

	const onScroll = (e: Event) => {
		const element = e.target as HTMLElement
		session.viewport.setScrollLeft(element.scrollLeft)
	}

	use.mount(() => {
		const observer = new ResizeObserver(entries => {
			for (const entry of entries) {
				timelineCanvas.resize(entry.contentRect.width)
			}
		})

		const timeline = use.rendered.then(() => dom.in(use.shadow).require(".timeline"))

		use.rendered.then(async () => {
			timelineCanvas.resize((await timeline).clientWidth)
			observer.observe(await timeline)
		})

		const unsubs = [
			session.viewport.$scrollLeft.on(async scrollLeft => {
				if ((await timeline).scrollLeft !== scrollLeft)
					(await timeline).scrollLeft = scrollLeft
			}),
			session.viewport.$zoom.on(timelineCanvas.scheduleDraw),
			session.$playhead.on(timelineCanvas.scheduleDraw),
			session.$selectedItem.on(timelineCanvas.scheduleDraw),
			session.$viewedItemId.on(timelineCanvas.scheduleDraw),
			context.strata.timeline.lens(s => s).on(timelineCanvas.scheduleDraw),
			context.strata.settings.on(timelineCanvas.scheduleDraw),
		]

		const detach = dom.events(timelineCanvas.canvas, {
			pointerdown: timelineCanvas.onPointerDown,
			pointermove: timelineCanvas.onPointerMove,
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
		</div>
	`
})
