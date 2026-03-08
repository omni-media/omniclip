
import {html} from "lit"
import {view} from "@e280/sly"

import styleCss from "./style.css.js"
import {TimelineCanvas} from "../../canvas/canvas.js"
import themeCss from "../../../../../../../../theme.css.js"
import {EditorContext} from "../../../../../../../../context/context.js"

export const TimelineArea = view(use => (context: EditorContext) => {
	use.styles(themeCss, styleCss)
	const session = context.session
	const editCanvas = use.once(() => new TimelineCanvas({
		session: context.session,
		timeline: context.strata.timeline,
		settings: context.strata.settings,
		player: context.controllers.player,
	}))

	const onScroll = (e: Event) => {
		const element = e.target as HTMLElement
		session.$timeline.scrollLeft.value = element.scrollLeft
	}

	use.mount(() => {
		let observer: ResizeObserver | undefined

		const syncViewport = async() => {
			await use.rendered
			const timeline = use.shadow.querySelector(".timeline-scroll") as HTMLElement | null
			if (!timeline)
				return

			session.$timeline.width.value = timeline.clientWidth
			editCanvas.setViewportWidth(timeline.clientWidth)
		}

		syncViewport()

		use.rendered.then(() => {
			const timeline = use.shadow.querySelector(".timeline-scroll") as HTMLElement | null
			if (!timeline)
				return

			observer = new ResizeObserver(entries => {
				for (const entry of entries) {
					const width = entry.contentRect.width
					session.$timeline.width.value = width
					editCanvas.setViewportWidth(width)
				}
			})
			observer.observe(timeline)
		})

		const unsubscribers = [
			session.$zoom.on(editCanvas.scheduleDraw),
			session.$playhead.on(editCanvas.scheduleDraw),
			session.$selectedItem.on(editCanvas.scheduleDraw),
			session.$viewedItemId.on(editCanvas.scheduleDraw),
			context.strata.timeline.on(editCanvas.scheduleDraw),
			context.strata.settings.on(editCanvas.scheduleDraw),
		]

		return () => {
			observer?.disconnect()
			editCanvas.dispose()
			for (const unsubscribe of unsubscribers)
				unsubscribe()
		}
	})

	return html`
		<div @scroll=${onScroll} class="timeline-scroll">
			${editCanvas.canvas}
		</div>
	`
})

