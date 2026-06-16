
import {html} from "lit"
import type {Pub} from "@e280/stz"
import {dom, shadow, useCss, useMount, useRendered, useShadow, useSignal} from "@e280/sly"

import styleCss from "./style.css.js"
import {clamp} from "../../../../../utils/math.js"
import themeCss from "../../../../../../../../../theme.css.js"

const minThumbWidth = 32

export const TimelineScrollbar = shadow((
	update: Pub,
	timeline: Promise<HTMLElement>,
	onScroll: (scrollLeft: number) => void,
) => {
	useCss(themeCss, styleCss)
	const root = useShadow()
	const thumbState = useSignal({
		x: 0,
		hidden: true,
		width: minThumbWidth
	})

	useMount(() => {
		const detaches: Array<() => void> = []

		useRendered().then(async () => {
			const scrollbar = dom.in(root).require(".timeline-scrollbar")
			const thumb = dom.in(root).require(".timeline-scrollbar-thumb")
			const element = await timeline

			const scrollMetrics = () => {
				const maxScroll = element.scrollWidth - element.clientWidth
				const trackWidth = element.clientWidth
				const thumbWidth = Math.max(minThumbWidth, trackWidth * element.clientWidth / element.scrollWidth)
				const maxThumbX = trackWidth - thumbWidth
				return {maxScroll, maxThumbX, thumbWidth}
			}

			const redraw = () => {
				const {maxScroll, maxThumbX, thumbWidth} = scrollMetrics()
				if (maxScroll <= 0) {
					thumbState({...thumbState.value, hidden: true})
					return
				}

				thumbState({
					hidden: false,
					width: thumbWidth,
					x: maxThumbX * element.scrollLeft / maxScroll,
				})
			}

			const setScroll = (scrollLeft: number) => {
				const {maxScroll} = scrollMetrics()
				onScroll(clamp(scrollLeft, 0, maxScroll))
				redraw()
			}

			const onTrackPointerDown = (event: PointerEvent) => {
				const {maxScroll, maxThumbX} = scrollMetrics()
				if (event.target === thumb)
					return

				const rect = scrollbar.getBoundingClientRect()
				const x = event.clientX - rect.left - thumb.offsetWidth / 2
				setScroll(maxScroll * x / maxThumbX)
			}

			const onThumbPointerDown = (event: PointerEvent) => {
				const {maxScroll, maxThumbX} = scrollMetrics()
				const startX = event.clientX
				const startScrollLeft = element.scrollLeft
				thumb.setPointerCapture(event.pointerId)

				const move = (event: PointerEvent) => {
					const deltaScroll = maxScroll * (event.clientX - startX) / maxThumbX
					setScroll(startScrollLeft + deltaScroll)
				}

				const up = (event: PointerEvent) => {
					thumb.releasePointerCapture(event.pointerId)
					detachDrag()
				}

				const detachDrag = dom.events(thumb, {
					pointermove: move,
					pointerup: up,
					pointercancel: up,
				})
			}

			detaches.push(dom.events(scrollbar, {pointerdown: onTrackPointerDown}))
			detaches.push(dom.events(thumb, {pointerdown: onThumbPointerDown}))
			detaches.push(update.on(redraw))
			redraw()
		})

		return () => {
			for (const detach of detaches)
				detach()
		}
	})

	return html`
		<div class="timeline-scrollbar">
			<div
				class="timeline-scrollbar-thumb"
				?hidden=${thumbState.value.hidden}
				style="width: ${thumbState.value.width}px; transform: translateX(${thumbState.value.x}px)"
			></div>
		</div>
	`
})

