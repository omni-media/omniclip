
import {html} from "lit"
import {pub} from "@e280/stz"
import {Item} from "@omnimedia/omnitool"
import {dom, shadow, useCss, useMount, useRendered, useShadow} from "@e280/sly"

import styleCss from "./style.css.js"
import {TimelineScrollbar} from "./scrollbar/view.js"
import {TimelineContextMenu} from "./context-menu/view.js"
import themeCss from "../../../../../../../../theme.css.js"
import {EditorContext} from "../../../../../../../../context/context.js"
import {itemLabel} from "../../../../../../../logic/utils/item-label.js"

import "@awesome.me/webawesome/dist/components/breadcrumb/breadcrumb.js"
import "@awesome.me/webawesome/dist/components/breadcrumb-item/breadcrumb-item.js"

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
				timelineCanvas.resize(entry.contentRect.width, entry.contentRect.height)
			}
		})

		const timeline = timelineElement()

		useRendered().then(async () => {
			const element = await timeline
			timelineCanvas.resize(element.clientWidth, element.clientHeight)
			observer.observe(await timeline)
		})

		const scrollLeft = async (scrollLeft: number) => {
			const element = await timeline
			if (element.scrollLeft === scrollLeft)
				return

			ignoreProgrammaticScroll = true
			element.scrollLeft = scrollLeft

			requestAnimationFrame(() => {
				ignoreProgrammaticScroll = false
			})
		}

		const afterDraw = async () => {
			const element = await timeline
			if (element.scrollLeft !== session.viewport.scrollLeft)
				element.scrollLeft = session.viewport.scrollLeft

			updateScrollbar()
		}

		const unsubs = [
			timelineCanvas.drawn.on(afterDraw),
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


	const renderTrail = () => {

		const path = () => {
			const items: Item.Any[] = []
			let item = session.index.getItemMaybe(session.$viewedItemId.value)
			while (item) {
				items.unshift(item)
				item = session.index.getParent(item.id)
			}
			return items
		}

		return html`
			<wa-breadcrumb>
				${path().map((item) => html`
					<wa-breadcrumb-item
						?data-current=${item.id === session.$viewedItemId()}
						@click=${() => {
							session.$viewedItemId(item.id)
							session.$selectedItem(item.id)
						}}
					>
						${itemLabel(item)}
					</wa-breadcrumb-item>
				`)}
			</wa-breadcrumb>
		`
	}

	return html`
		<nav class="timeline-path" aria-label="Timeline location">
			${renderTrail()}
		</nav>
		<div @scroll=${onScroll} class="timeline">
			${timelineCanvas.canvas}
			${timelineCanvas.spacer}
		</div>
		${TimelineScrollbar(updateScrollbar, timelineElement(), scrollLeft =>
			session.viewport.setScrollLeft(scrollLeft)
		)}
		${TimelineContextMenu(context)}
	`
})

