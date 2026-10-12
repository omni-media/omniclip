
import {html} from "lit"
import {waitGot} from "@e280/strata"
import {Filmstrip, Item, ms} from "@omnimedia/omnitool"
import {shadow, useCss, useMount, useSignal, useWait} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../../../../../../../../../../theme.css.js"
import {EditorContext} from "../../../../../../../../../../context/context.js"

export const FilmstripView = shadow((
	context: EditorContext,
	clip: Item.Video,
) => {
	useCss(styleCss, themeCss)

	const session = context.session
	const pixelsPerMillisecond = session.viewport.durationToWidth(ms(1))

	const thumbnails = useSignal<{ time: number, canvas: HTMLCanvasElement | OffscreenCanvas }[]>([])

	const THUMB_WIDTH_PX = 100

	const getFrequencyInSec = () => {
		const pixelsPerMillisecond = session.viewport.durationToWidth(ms(1))
		const freq = THUMB_WIDTH_PX / (pixelsPerMillisecond * 1000)
		return Math.round(freq * 1000) / 1000
	}

	function cloneCanvas(source: HTMLCanvasElement | OffscreenCanvas) {
		const clone = document.createElement('canvas')
		clone.width = source.width
		clone.height = source.height
		const ctx = clone.getContext('2d')
		if (ctx) ctx.drawImage(source as HTMLCanvasElement, 0, 0)
		return clone
	}

	const filmstrip = useWait(() =>
		Filmstrip.init("/assets/temp/gl.mp4", {
			frequency: 1,
			onPlaceholders: times => {
				thumbnails(times.map(time => {
					const closest = thumbnails().reduce((a, b) =>
						Math.abs(b.time - time) < Math.abs(a.time - time) ? b : a,
					)
					return {
						time,
						canvas: cloneCanvas(closest.canvas)
					}
				}))
			},
			onChange: async tiles => thumbnails(tiles.map(({canvas, time}) => ({canvas: canvas.canvas, time}))),
			canvasSinkOptions: {width: THUMB_WIDTH_PX, height: 50, fit: "cover"},
		})
	)

	const update = async () => {
		const viewportStart = session.viewport.visibleStart()
		const viewportEnd = session.viewport.visibleEnd()
		const visibleClipStart = Math.max(clip.start, viewportStart)
		const visibleClipEnd = Math.min(clip.start + clip.duration, viewportEnd)

		if (visibleClipStart < visibleClipEnd)
			waitGot(await filmstrip.result).update({
				range: [
					(visibleClipStart - clip.start) / 1000,
					(visibleClipEnd - clip.start) / 1000,
				],
				frequency: getFrequencyInSec(),
			})
	}

	useMount(() => {
		update()
		const dispose1 = session.viewport.$zoom.on(update)
		const dispose2 = session.viewport.$scrollLeft.on(update)
		const dispose3 = session.viewport.$width.on(update)
		return () => {
			dispose1()
			dispose2()
			dispose3()
		}
	})

	return html`
		<div class="filmstrip-container">
			${thumbnails().map(({time, canvas}) => html`
				<div
					class="thumbnail"
					style="
						left:  ${Math.round((time * 1000 * pixelsPerMillisecond) / THUMB_WIDTH_PX) * THUMB_WIDTH_PX}px;
						width: ${THUMB_WIDTH_PX}px;
					"
				>
					${canvas}
				</div>
			`)}
		</div>
	`
})
