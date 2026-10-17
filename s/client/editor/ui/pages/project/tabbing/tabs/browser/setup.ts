
import {brain, type MediaLibrary} from "@e280/quay"

import {type MediaItem, MediaItemPreview} from "./views/media-item-preview/view.js"

type SetupMediaGroupOptions = {
	group: string
	library: MediaLibrary
	onAdd: (event: Event, item: MediaItem) => void
	onRemove: (event: Event, item: MediaItem) => void
}

export function setupMediaGroup({group, library, onAdd, onRemove}: SetupMediaGroupOptions) {
	library.config.renderPreview = item => MediaItemPreview({
		item,
		library,
		onAdd: event => onAdd(event, item),
		onRemove: event => onRemove(event, item),
	})

	return brain.setGroup(group, library)
}

