
import {loot} from "@e280/sly"
import {type MediaLibrary} from "@e280/quay"

import {type MediaItem} from "./views/media-item-preview/view.js"

type DraggedMedia = {
	library: MediaLibrary
	item: MediaItem
}

type MediaDestination = {
	library: MediaLibrary
	folder: MediaItem
	from?: MediaLibrary
}

export class MediaDrag {
	#pointerY = 0
	#scrollFrame = 0
	#scrollPanel: HTMLElement | null = null
	#drag: loot.DragAndDrops<DraggedMedia, MediaDestination>

	constructor(private allMedia: MediaLibrary, private project: MediaLibrary) {
		this.#drag = new loot.DragAndDrops({
			acceptDrop: (_event, source, target) => {
				const action = this.#action(source, target)
				if (action) void action().catch(error => alert(error instanceof Error ? error.message : String(error)))
				// TODO: should be toast instead
			},
		})
	}

	source(library: MediaLibrary, item: MediaItem) {
		return this.#drag.dragzone(() => ({library, item}))
	}

	autoScroll = (event: DragEvent) => {
		this.#scrollPanel = event.currentTarget as HTMLElement
		this.#pointerY = event.clientY
		if (!this.#scrollFrame) this.#scrollFrame = requestAnimationFrame(this.#scroll)
	}

	#scroll = () => {
		this.#scrollFrame = 0
		const panel = this.#scrollPanel
		if (!this.#drag.dragging || !panel) return

		const {top, bottom} = panel.getBoundingClientRect()
		const edge = 48
		const direction = this.#pointerY < top + edge ? -1 : this.#pointerY > bottom - edge ? 1 : 0
		if (!direction) return

		const distance = direction < 0 ? top + edge - this.#pointerY : this.#pointerY - bottom + edge
		panel.scrollTop += direction * Math.min(18, Math.ceil(distance / 5))
		this.#scrollFrame = requestAnimationFrame(this.#scroll)
	}

	target(library: MediaLibrary, folder: () => MediaItem, from?: MediaLibrary) {
		const destination = () => ({library, folder: folder(), from})
		const controller = this.#drag
		const dropzone = this.#drag.dropzone(destination)
		const canDrop = () => !!this.#action(this.#drag.dragging, destination())

		return {
			get hovering() {
				const current = controller.hovering
				return current?.library === library && current.folder === folder()
			},
			dragover: (event: DragEvent) => {
				if (event.defaultPrevented || !canDrop()) return
				dropzone.dragover(event)
				if (event.dataTransfer)
					event.dataTransfer.dropEffect = this.#drag.dragging?.library === library ? "move" : "copy"
			},
			dragleave: dropzone.dragleave,
			drop: (event: DragEvent) => {
				if (!event.defaultPrevented && canDrop()) dropzone.drop(event)
			},
		}
	}

	#action(source: DraggedMedia | undefined, target: MediaDestination) {
		if (!source || (target.from && target.from !== source.library)) return
		const {item, library} = source
		if (!item.isKind("file") || !item.specimen.hash) return
		if (library === target.library)
			return item.parent === target.folder ? undefined : () => library.move(item, target.folder)
		if (library === this.allMedia && target.library === this.project && !this.project.findByHash(item.specimen.hash))
			return () => this.project.include(item.specimen.hash!, target.folder)
	}
}

