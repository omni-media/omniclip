
import {css, html} from "lit"
import {shadow, useCss} from "@e280/sly"
import {type MediaLibrary} from "@e280/quay"

import {type MediaDrag} from "../setup.js"
import {type MediaItem} from "./media-item-preview/view.js"

export const FolderPreview = shadow((library: MediaLibrary, item: MediaItem, drag: MediaDrag) => {
	useCss(css`
		:host {
			display: block;
			width: 100%;
			height: 100%;
		}

		.folder {
			position: relative;
			display: grid;
			place-items: center;
			width: 100%;
			height: 100%;
		}

		.count {
			position: absolute;
			top: 4px;
			left: 4px;
			padding: 2px 4px;
			border-radius: 4px;
			background: #0009;
			color: var(--quay-text);
			font-size: var(--font-size-xs);
			font-variant-numeric: tabular-nums;
			line-height: 1;
		}

		.folder[data-hover] {
			outline: 1px solid var(--quay-accent);
			outline-offset: -2px;
		}
	`)

	const dropzone = drag.dropzone(() => item)
	return html`
		<div class="folder" ?data-hover=${drag.hovering === item}
			@dragover=${(event: DragEvent) => {
				if (drag.dragging)
					dropzone.dragover(event)
			}}
			@dragleave=${dropzone.dragleave}
			@drop=${(event: DragEvent) => {
				if (drag.dragging) dropzone.drop(event)
			}}>
			<span class="count">${item.children.length}</span>
			${library.config.renderIcon(item, false)}
		</div>
	`
})

