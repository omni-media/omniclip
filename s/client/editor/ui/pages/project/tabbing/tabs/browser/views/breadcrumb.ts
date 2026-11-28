
import {css, html} from "lit"
import {shadow, useCss} from "@e280/sly"
import {type MediaLibrary} from "@e280/quay"

import {type MediaDrag} from "../drag-drop.js"

export const Breadcrumb = shadow((library: MediaLibrary, drag: MediaDrag) => {
	useCss(css`
		:host {
			display: block;
			min-width: 0;
		}

		.label {
			padding: 0.25em 0.4em;
			border-radius: var(--quay-radius);
		}

		.label[data-hover] {
			background: var(--quay-surface-hover);
			outline: 1px solid var(--quay-accent);
		}
	`)

	return html`
		<sl-breadcrumb>
			${library.trail.signal().map(item => {
				const drop = drag.target(library, () => item)
				const label = item === library.config.root ? "root" : item.specimen.label
				return html`
					<sl-breadcrumb-item
						@click=${() => library.trail.open(item)}
						@dragover=${drop.dragover}
						@dragleave=${drop.dragleave}
						@drop=${drop.drop}>
						<span class="label" ?data-hover=${drop.hovering}>${label}</span>
					</sl-breadcrumb-item>
				`
			})}
		</sl-breadcrumb>
	`
})

