
import {brain} from "@e280/quay"

import {MEDIA_GROUP} from "./constants.js"
import {EditorContext} from "../../../../../../context/context.js"
import {MediaItem, MediaItemPreview} from "./views/media-item-preview/view.js"

export function setupMediaGroup(
	context: EditorContext,
	addMedia: (event: Event, item: MediaItem) => void
) {
	const library = context.controllers.cargo.mediaLibrary

	library.config.renderPreview = item => MediaItemPreview({
		item,
		library,
		onAdd: event => addMedia(event, item),
	})

	return brain.setGroup(MEDIA_GROUP, library)
}

