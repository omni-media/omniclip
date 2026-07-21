
import {html} from "lit"
import {MediaLibrary} from "@e280/quay"
import {shadow, useCss} from "@e280/sly"

import styleCss from "./style.css.js"
import {VideoPreview} from "../video-preview/view.js"

export type MediaItem = Parameters<MediaLibrary["config"]["renderPreview"]>[0]

type MediaItemPreviewOptions = {
	item: MediaItem
	library: MediaLibrary
	onAdd: (event: Event) => void
	onRemove: (event: Event) => void
}

export const MediaItemPreview = shadow((options: MediaItemPreviewOptions) => {
	useCss(styleCss)

	const {item} = options
	const addable = item.isKind("file") && !!item.specimen.hash && item.specimen.format !== "other"

	const renderPreview = () => {
		if (!item.isKind("file"))
			return options.library.config.renderIcon(item, false)

		if (item.specimen.previewUrl)
			return html`<img src=${item.specimen.previewUrl} alt=${item.specimen.label} />`

		if (item.specimen.format === "video" && item.specimen.hash)
			return VideoPreview({
				library: options.library,
				hash: item.specimen.hash,
				mime: item.specimen.mime ?? "",
				label: item.specimen.label,
			})

		return options.library.config.renderIcon(item, false)
	}

	return html`
		<div
			class="preview"
			?data-addable=${addable}
			title=${addable ? "Double-click to add to timeline" : ""}
			@dblclick=${options.onAdd}
		>
			${renderPreview()}
			${addable ? html`
				<div class="overlay" aria-hidden="true">
					<wa-icon name="plus"></wa-icon>
				</div>
			` : null}
			${item.isKind("file") && item.specimen.hash ? html`
				<button class="remove" title="Remove from media bin" @click=${options.onRemove}>
					<wa-icon name="trash"></wa-icon>
				</button>
			` : null}
		</div>
	`
})

