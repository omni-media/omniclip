
import {Item, Filmstrip} from "@omnimedia/omnitool"
import {ms} from "@omnimedia/omnitool/x/units/ms.js"

import {metrics, styles} from "../draw/styles.js"
import type {TimelineCanvas} from "../canvas.js"
import type {TimelineClipBox} from "../draw/clip.js"

type Tile = {
	time: number
	canvas: HTMLCanvasElement | OffscreenCanvas
}

type Entry = {
	filmstrip: Filmstrip | null
	tiles: Tile[]
}

const THUMB_WIDTH_PX = 100

export class TimelineFilmstrips {
	#entries = new Map<number, Entry>()

	constructor(private canvas: TimelineCanvas) {}

	retain(itemIds: Set<number>) {
		for (const id of this.#entries.keys()) {
			if (!itemIds.has(id))
				this.#entries.delete(id)
		}
	}

	draw(ctx: CanvasRenderingContext2D, box: TimelineClipBox) {
		const clip = this.canvas.deps.session.index.getItem<Item.Video>(box.itemId)
		const media = this.canvas.deps.resolveMedia(clip)

		if (!media) {
			this.#drawMissingMedia(ctx, box)
			return
		}

		const entry = this.#entry(clip)
		this.#sync(entry, box, clip)

		ctx.save()
		ctx.beginPath()
		ctx.rect(box.x, box.y, box.width, box.height)
		ctx.clip()

		for (const tile of entry.tiles) {
			const x = box.x + this.#tileLeft(box, clip, tile.time)
			const width = this.#tileWidth(box, clip)
			if (x >= box.x + box.width || x + width <= box.x)
				continue

			ctx.drawImage(tile.canvas as CanvasImageSource, x, box.y, width, box.height)
		}

		ctx.fillStyle = "rgba(0, 0, 0, 0.18)"
		ctx.fillRect(box.x, box.y, box.width, box.height)
		ctx.restore()
	}

	#entry(clip: Item.Video) {
		const existing = this.#entries.get(clip.id)
		if (existing)
			return existing

		const media = this.canvas.deps.resolveMedia(clip)!

		const entry: Entry = {
			tiles: [],
			filmstrip: null
		}

		Filmstrip.init(media.url, {
			frequency: this.#frequencyInSeconds(),
			onPlaceholders: times => {
				if (entry.tiles.length === 0)
					return

				entry.tiles = times.map(time => ({
					time,
					canvas: this.#closest(entry.tiles, time).canvas,
				}))
				this.canvas.scheduleDraw()
			},
			onChange: async tiles => {
				entry.tiles = tiles.map(({canvas, time}) => ({canvas: canvas.canvas, time}))
				this.canvas.scheduleDraw()
			},
			canvasSinkOptions: {
				width: THUMB_WIDTH_PX,
				height: metrics.trackHeight,
				fit: "cover",
			}
		}).then(filmstrip => {
			entry.filmstrip = filmstrip
			this.canvas.scheduleDraw()
		})

		this.#entries.set(clip.id, entry)
		return entry
	}

	#drawMissingMedia(ctx: CanvasRenderingContext2D, box: TimelineClipBox) {
		ctx.save()
		ctx.beginPath()
		ctx.roundRect(box.x, box.y, box.width, box.height, metrics.clipRadius)
		ctx.clip()
		ctx.fillStyle = "rgba(0, 0, 0, 0.25)"
		ctx.fillRect(box.x, box.y, box.width, box.height)
		ctx.fillStyle = styles.text
		ctx.font = "12px sans-serif"
		ctx.textBaseline = "middle"
		ctx.fillText("missing media for clip", box.x + metrics.labelInsetX, box.y + box.height / 2)
		ctx.restore()
	}

	#sync(entry: Entry, box: TimelineClipBox, clip: Item.Video) {
		const range = this.#visibleRange(box, clip)
		if (!range)
			return

		const frequency = this.#frequencyInSeconds()
		entry.filmstrip?.update({range, frequency})
	}

	#visibleRange(box: TimelineClipBox, clip: Item.Video) {
		const viewportLeft = this.canvas.viewport.scrollLeft
		const viewportRight = viewportLeft + this.canvas.viewport.width
		const previewOffset = this.canvas.trimPreviewOffsetPx()
		const renderedLeft = box.x + previewOffset
		const renderedRight = renderedLeft + box.width
		const visibleLeft = Math.max(renderedLeft, viewportLeft)
		const visibleRight = Math.min(renderedRight, viewportRight)

		if (visibleLeft >= visibleRight)
			return null

		const start = clip.start + this.canvas.viewport.xToTime(visibleLeft - renderedLeft)
		const end = clip.start + this.canvas.viewport.xToTime(visibleRight - renderedLeft)
		return [start / 1000, end / 1000] as [number, number]
	}

	#frequencyInSeconds() {
		const pixelsPerMillisecond = this.canvas.viewport.durationToWidth(ms(1))
		return THUMB_WIDTH_PX / (pixelsPerMillisecond * 1000)
	}

	#tileLeft(box: TimelineClipBox, clip: Item.Video, time: number) {
		if (clip.duration <= 0)
			return 0

		return ((time * 1000 - clip.start) / clip.duration) * box.width
	}

	#tileWidth(box: TimelineClipBox, clip: Item.Video) {
		if (clip.duration <= 0)
			return 0

		return (this.#frequencyInSeconds() * 1000 / clip.duration) * box.width
	}

	#closest(tiles: Tile[], time: number) {
		return tiles.reduce((a, b) =>
			Math.abs(b.time - time) < Math.abs(a.time - time) ? b : a,
		)
	}
}

