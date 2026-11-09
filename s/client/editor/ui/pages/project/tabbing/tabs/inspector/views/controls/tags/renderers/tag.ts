
import {html} from "lit"
import type {loot} from "@e280/sly"

import type {Tag} from "../../../../../../../../../../context/parts/tags/types.js"

type Options = {
	assigned: readonly string[]
	index: number
	setsColor: boolean
	dnd: loot.DragAndDrops<string, string>
	remove: () => void
}

export function renderTag(tag: Tag, options: Options) {
	const {assigned, index, setsColor, dnd} = options
	const draggedId = dnd.dragging
	const targetId = dnd.hovering
	const dragzone = dnd.dragzone(() => tag.id)
	const dropzone = dnd.dropzone(() => tag.id)
	const dropSide = targetId === tag.id && draggedId && draggedId !== tag.id
		? assigned.indexOf(draggedId) < index ? "after" : "before"
		: ""

	const startDrag = (event: DragEvent) => {
		event.stopPropagation()
		event.dataTransfer!.effectAllowed = "move"
		event.dataTransfer!.setData("text/plain", "")
		dragzone.dragstart(event)
	}

	const dragOver = (event: DragEvent) => {
		if (!dnd.dragging) return
		event.stopPropagation()
		event.dataTransfer!.dropEffect = "move"
		dropzone.dragover(event)
	}

	const drop = (event: DragEvent) => {
		event.stopPropagation()
		dropzone.drop(event)
	}

	const remove = (event: Event) => {
		event.stopPropagation()
		options.remove()
	}

	return html`
		<li class="chip" draggable="true"
			?data-dragging=${draggedId === tag.id}
			data-drop=${dropSide}
			aria-label=${`${tag.label}, ${index + 1} of ${assigned.length}${setsColor ? ", sets color" : ""}`}
			@dragstart=${startDrag}
			@dragover=${dragOver}
			@dragleave=${dropzone.dragleave}
			@dragend=${dragzone.dragend}
			@drop=${drop}>
			<wa-tag size="small" appearance="outlined" with-remove
				title=${setsColor ? "First colored tag: sets this item’s color" : tag.label}
				@wa-remove=${remove}>
				${tag.color ? html`<span class="swatch" style=${`background-color: ${tag.color}`}></span>` : ""}
				${tag.label}
			</wa-tag>
		</li>
	`
}

