
import {brain, type MediaLibrary} from "@e280/quay"

import {type MediaItem, MediaItemPreview} from "./views/media-item-preview/view.js"
import {FolderLabel} from "./views/folder-label.js"

type SetupMediaGroupOptions = {
	group: string
	library: MediaLibrary
	onAdd: (event: Event, item: MediaItem) => void
	onRemove: (event: Event, item: MediaItem) => void
}

export function setupMediaGroup({group, library, onAdd, onRemove}: SetupMediaGroupOptions) {
	library.config.renderLabel = item => item.isKind("folder") ? FolderLabel(library, item) : item.specimen.label
	library.config.renderPreview = item => item.isKind("folder")
		? library.config.renderIcon(item, false)
		: MediaItemPreview({
			item,
			library,
			onAdd: event => onAdd(event, item),
			onRemove: event => onRemove(event, item),
		})

	return brain.setGroup(group, library)
}

