import {html} from "lit"
import {view} from "@e280/sly"
import {Filmstrip, Item} from "@omnimedia/omnitool"

import styleCss from "./style.css.js"
import themeCss from "../../../../../../../../../../theme.css.js"
import {EditorContext} from "../../../../../../../../../../context/context.js"

export const FilmstripView = view(use => (
	context: EditorContext,
	clip: Item.Video,
) => {
	use.styles(styleCss, themeCss)

	const session = context.session
	const pixelsPerMillisecond = 0.1 * session.$zoom.value

	const thumbnails = use.signal<{ time: number, canvas: HTMLCanvasElement | OffscreenCanvas }[]>([])

	const THUMB_WIDTH_PX = 100

	const getFrequencyInSec = (zoom: number) => {
		const pixelsPerMillisecond = 0.1 * zoom
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

	const op = use.op.promise<Filmstrip>(
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

	const filmstrip = op.isLoading ? op.wait : op.require()

	const update = async (scrollLeft: number) => {
		const viewportStart = scrollLeft / pixelsPerMillisecond
		const viewportEnd = (scrollLeft + session.$timeline.width.value) / pixelsPerMillisecond
		const visibleClipStart = Math.max(clip.start, viewportStart)
		const visibleClipEnd = Math.min(clip.start + clip.duration, viewportEnd)

		if (visibleClipStart < visibleClipEnd)
			(await filmstrip).range = [
				(visibleClipStart - clip.start) / 1000,
				(visibleClipEnd - clip.start) / 1000,
			]
	}

	use.once(async () => update(0))

	use.mount(() => {
		const dispose1 = session.$zoom.on(async (zoom) => {(await filmstrip).frequency = getFrequencyInSec(zoom)})
		const dispose2 = session.$timeline.scrollLeft.on(async (scrollLeft) => update(scrollLeft))
		return () => {
			dispose1()
			dispose2()
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
