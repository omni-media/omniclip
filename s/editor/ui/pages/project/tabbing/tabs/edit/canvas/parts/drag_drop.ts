
import {loot} from "@e280/sly"

import type {TimelineCanvas} from "../canvas.js"
import type {DropIntent} from "../../../../../../../logic/parts/interactions/drag/parts/intent.js"

export type CanvasDrag = {
	targets: DropIntent[]
	drop: (target: DropIntent) => void
}

export class CanvasDragDrop {
	#data!: CanvasDrag

	dnd = new loot.DragAndDrops<CanvasDrag, DropIntent>({
		acceptDrop: (_, drag, target) => drag.drop(target),
	})

	#dragzone = this.dnd.dragzone(() => this.#data)
	#dropzone = this.dnd.dropzone(() => this.canvas.deps.session.$drop.value!)

	constructor(private canvas: TimelineCanvas) {}

	get dragging() {
		return this.dnd.dragging
	}

	start = (event: DragEvent, data: CanvasDrag) => {
		const source = event.currentTarget as HTMLElement
		const bounds = source.getBoundingClientRect()
		const transfer = event.dataTransfer!
		transfer.setDragImage(source, event.clientX - bounds.left, event.clientY - bounds.top)
		transfer.effectAllowed = "copy"
		transfer.setData("text/plain", "")
		this.#data = data
		this.#dragzone.dragstart(event)
		this.canvas.scheduleDraw()
	}

	end = (event: DragEvent) => {
		this.#dragzone.dragend(event)
		this.#setTarget(null)
	}

	dragover = (event: DragEvent) => {
		if (!event.dataTransfer || !this.dragging)
			return

		const target = this.#dropTargetAt(event)
		this.#setTarget(target)
		if (target) {
			this.#dropzone.dragover(event)
			event.dataTransfer.dropEffect = "copy"
		} else
			this.dnd.$droppy.value = undefined
	}

	dragleave = (event: DragEvent) => {
		this.#dropzone.dragleave(event)
		this.#setTarget(null)
	}

	drop = this.#dropzone.drop

	#dropTargetAt(event: DragEvent) {
		const point = this.canvas.pointAt(event)
		const x = point.x + this.canvas.viewport.scrollLeft - this.canvas.trimPreviewOffsetPx()
		return this.dragging?.targets.findLast(({indicator}) =>
			x >= indicator.x - (indicator.width ? 0 : 24) &&
			x <= indicator.x + indicator.width + (indicator.width ? 0 : 24) &&
			point.y >= indicator.y && point.y <= indicator.y + indicator.height
		) ?? null
	}

	#setTarget(target: DropIntent | null) {
		this.canvas.deps.session.$drop.value = target
		this.canvas.scheduleDraw()
	}
}

