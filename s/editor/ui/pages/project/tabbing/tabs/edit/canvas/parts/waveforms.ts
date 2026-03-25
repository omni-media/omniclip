
import {Item} from "@omnimedia/omnitool"
import {Waveform} from "@omnimedia/omnitool/x/timeline/parts/waveform/waveform.js"
import type {WaveformTileData} from "@omnimedia/omnitool/x/timeline/parts/waveform/parts/types.js"

import {metrics} from "../draw/styles.js"
import type {TimelineCanvas} from "../canvas.js"
import type {TimelineClipBox} from "../draw/clip.js"

type Entry = {
	waveform: Promise<Waveform>
	tiles: WaveformTileData[]
}

export class TimelineWaveforms {
	#entries = new Map<number, Entry>()

	constructor(private canvas: TimelineCanvas) {}

	retain(itemIds: Set<number>) {
		for (const id of this.#entries.keys()) {
			if (!itemIds.has(id))
				this.#entries.delete(id)
		}
	}

	draw(ctx: CanvasRenderingContext2D, box: TimelineClipBox) {
		const clip = this.canvas.deps.session.index.getItem<Item.Audio>(box.itemId)
		const entry = this.#entry(clip)
		this.#sync(entry, box, clip)

		ctx.save()
		ctx.beginPath()
		ctx.roundRect(box.x, box.y, box.width, box.height, metrics.clipRadius)
		ctx.clip()

		for (const tile of entry.tiles) {
			const x = box.x + this.#tileLeft(box, clip, tile.startTime)
			const width = this.#tileWidth(box, clip, tile)
			if (x >= box.x + box.width || x + width <= box.x)
				continue

			ctx.drawImage(tile.canvas, x, box.y, width, box.height)
		}

		ctx.restore()
	}

	#entry(clip: Item.Audio) {
		const existing = this.#entries.get(clip.id)
		if (existing)
			return existing

		const entry: Entry = {
			tiles: [],
			waveform: Promise.resolve(null as never),
		}

		entry.waveform = Waveform.init(
			this.canvas.deps.driver,
			this.canvas.deps.resolveMedia(clip.mediaHash),
			{
				tileHeight: metrics.trackHeight,
				color: "rgb(196, 80, 115)",
				onChange: (tiles: WaveformTileData[]) => {
					entry.tiles = tiles
					this.canvas.scheduleDraw()
				}
			}
		).then((waveform: Waveform) => {
			this.canvas.scheduleDraw()
			return waveform
		})

		this.#entries.set(clip.id, entry)
		return entry
	}

	#sync(entry: Entry, box: TimelineClipBox, clip: Item.Audio) {
		const range = this.#visibleRange(box, clip)
		if (!range)
			return

		const zoom = this.#pixelsPerSecond(box, clip)
		void entry.waveform.then(waveform => {
			if (
				waveform.zoom === zoom &&
				waveform.range[0] === range[0] &&
				waveform.range[1] === range[1]
			)
				return

			waveform.zoom = zoom
			waveform.range = range
		})
	}

	#visibleRange(box: TimelineClipBox, clip: Item.Audio) {
		const viewportLeft = this.canvas.viewport.scrollLeft
		const viewportRight = viewportLeft + this.canvas.viewport.width
		const visibleLeft = Math.max(box.x, viewportLeft)
		const visibleRight = Math.min(box.x + box.width, viewportRight)

		if (visibleLeft >= visibleRight || clip.duration <= 0 || box.width <= 0)
			return null

		const visibleStart = (visibleLeft - box.x) / box.width
		const visibleEnd = (visibleRight - box.x) / box.width
		const start = clip.start + clip.duration * visibleStart
		const end = clip.start + clip.duration * visibleEnd
		return [start / 1000, end / 1000] as [number, number]
	}

	#pixelsPerSecond(box: TimelineClipBox, clip: Item.Audio) {
		if (clip.duration <= 0)
			return 1
		return box.width / (clip.duration / 1000)
	}

	#tileLeft(box: TimelineClipBox, clip: Item.Audio, startTime: number) {
		if (clip.duration <= 0)
			return 0
		return ((startTime * 1000 - clip.start) / clip.duration) * box.width
	}

	#tileWidth(box: TimelineClipBox, clip: Item.Audio, tile: WaveformTileData) {
		if (clip.duration <= 0)
			return 0
		return (((tile.endTime - tile.startTime) * 1000) / clip.duration) * box.width
	}
}

