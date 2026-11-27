
import {loot} from "@e280/sly"
import {brain, type MediaLibrary} from "@e280/quay"

import {FolderLabel} from "./views/folder-label.js"
import {FolderPreview} from "./views/folder-preview.js"
import {type MediaItem, MediaItemPreview} from "./views/media-item-preview/view.js"

function createMediaDrag(library: MediaLibrary) {
	return new loot.DragAndDrops<MediaItem, MediaItem>({
		acceptDrop: (_event, item, folder) => {
			if (item.parent === folder) return
			void library.move(item, folder).catch(error =>
				alert(error instanceof Error ? error.message : String(error))
			)
		// TODO: should be toast instead
		},
	})
}

export type MediaDrag = ReturnType<typeof createMediaDrag>

type SetupMediaGroupOptions = {
	group: string
	library: MediaLibrary
	onAdd: (event: Event, item: MediaItem) => void
	onRemove: (event: Event, item: MediaItem) => void
}

export function setupMediaGroup({group, library, onAdd, onRemove}: SetupMediaGroupOptions) {
	const drag = createMediaDrag(library)
	library.config.renderLabel = item => item.isKind("folder") ? FolderLabel(library, item) : item.specimen.label
	library.config.renderPreview = item => item.isKind("folder")
		? FolderPreview(library, item, drag)
		: MediaItemPreview({
			item,
			library,
			drag,
			onAdd: event => onAdd(event, item),
			onRemove: event => onRemove(event, item),
		})

	return brain.setGroup(group, library)
}

