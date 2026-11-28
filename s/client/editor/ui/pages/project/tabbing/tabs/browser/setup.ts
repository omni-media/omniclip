
import {brain, type MediaLibrary} from "@e280/quay"

import {type MediaDrag} from "./drag-drop.js"
import {FolderLabel} from "./views/folder-label.js"
import {FolderPreview} from "./views/folder-preview.js"
import {type MediaItem, MediaItemPreview} from "./views/media-item-preview/view.js"

type SetupMediaGroupOptions = {
	group: string
	library: MediaLibrary
	drag: MediaDrag
	onAdd: (event: Event, item: MediaItem) => void
	onRemove: (event: Event, item: MediaItem) => void
}

export function setupMediaGroup({group, library, drag, onAdd, onRemove}: SetupMediaGroupOptions) {
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

