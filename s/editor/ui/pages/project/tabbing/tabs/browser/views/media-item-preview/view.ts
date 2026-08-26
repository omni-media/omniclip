
import {html} from "lit"
import {MediaLibrary} from "@e280/quay"
import {shadow, useCss, useMount, useSignal} from "@e280/sly"

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
	const progress = useSignal(0)
	const uploading = () => item.isKind("file") && !item.specimen.hash
	const addable = item.isKind("file") && !!item.specimen.hash && item.specimen.format !== "other"

	useMount(() => {
		return options.library.progress.sub(update => {
			if (update.item !== item)
				return

			progress(update.loaded / update.total)
		})
	})

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
		<div class="preview">
			${renderPreview()}
			${uploading() ? html`
				<div class="upload" style=${`--progress: ${progress() * 100}%`}>
					<span>${Math.round(progress() * 100)}%</span>
				</div>
			` : null}
			${addable ? html`
				<button class="add" title="Add to timeline" aria-label="Add to timeline" @click=${options.onAdd}>
					<wa-icon name="plus"></wa-icon>
				</button>
			` : null}
			${item.isKind("file") && item.specimen.hash ? html`
				<button class="remove" title="Remove from media bin" @click=${options.onRemove}>
					<wa-icon name="trash"></wa-icon>
				</button>
			` : null}
		</div>
	`
})

