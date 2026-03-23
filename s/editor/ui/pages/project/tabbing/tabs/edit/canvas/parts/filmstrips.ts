
import {Item, Filmstrip} from "@omnimedia/omnitool"
import {ms} from "@omnimedia/omnitool/x/units/ms.js"

import {metrics} from "../draw/styles.js"
import type {TimelineCanvas} from "../canvas.js"
import type {TimelineClipBox} from "../draw/clip.js"

type Tile = {
	time: number
	canvas: HTMLCanvasElement | OffscreenCanvas
}

type Entry = {
	filmstrip: Promise<Filmstrip>
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
		const entry = this.#entry(clip)
		this.#sync(entry, box, clip)

		ctx.save()
		ctx.beginPath()
		ctx.roundRect(box.x, box.y, box.width, box.height, metrics.clipRadius)
		ctx.clip()

		for (const tile of entry.tiles) {
			const x = box.x + this.#tileLeft(tile.time)
			if (x >= box.x + box.width || x + THUMB_WIDTH_PX <= box.x)
				continue

			ctx.drawImage(tile.canvas as CanvasImageSource, x, box.y, THUMB_WIDTH_PX, box.height)
		}

		ctx.fillStyle = "rgba(0, 0, 0, 0.18)"
		ctx.fillRect(box.x, box.y, box.width, box.height)
		ctx.restore()
	}

	#entry(clip: Item.Video) {
		const existing = this.#entries.get(clip.id)
		if (existing)
			return existing

		const entry: Entry = {
			tiles: [],
			filmstrip: Promise.resolve(null as never)
		}

		entry.filmstrip = Filmstrip.init(this.canvas.deps.resolveMedia(clip.mediaHash), {
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
		})

		this.#entries.set(clip.id, entry)
		return entry
	}

	#sync(entry: Entry, box: TimelineClipBox, clip: Item.Video) {
		const range = this.#visibleRange(box, clip)
		if (!range)
			return

		const frequency = this.#frequencyInSeconds()
		void entry.filmstrip.then(filmstrip => {
			filmstrip.frequency = frequency
			filmstrip.range = range
		})
	}

	#visibleRange(box: TimelineClipBox, clip: Item.Video) {
		const viewportLeft = this.canvas.viewport.scrollLeft
		const viewportRight = viewportLeft + this.canvas.viewport.width
		const visibleLeft = Math.max(box.x, viewportLeft)
		const visibleRight = Math.min(box.x + box.width, viewportRight)

		if (visibleLeft >= visibleRight)
			return null

		const start = clip.start + this.canvas.viewport.xToTime(visibleLeft - box.x)
		const end = clip.start + this.canvas.viewport.xToTime(visibleRight - box.x)
		return [start / 1000, end / 1000] as [number, number]
	}

	#frequencyInSeconds() {
		const pixelsPerMillisecond = this.canvas.viewport.durationToWidth(ms(1))
		const frequency = THUMB_WIDTH_PX / (pixelsPerMillisecond * 1000)
		return Math.round(frequency * 1000) / 1000
	}

	#tileLeft(time: number) {
		const pixelsPerMillisecond = this.canvas.viewport.durationToWidth(ms(1))
		return Math.round((time * 1000 * pixelsPerMillisecond) / THUMB_WIDTH_PX) * THUMB_WIDTH_PX
	}

	#closest(tiles: Tile[], time: number) {
		return tiles.reduce((a, b) =>
			Math.abs(b.time - time) < Math.abs(a.time - time) ? b : a,
		)
	}
}

