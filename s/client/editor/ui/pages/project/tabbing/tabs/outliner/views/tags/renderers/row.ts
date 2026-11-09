
import {html} from "lit"

import {renderColorEditor} from "./color.js"
import binSvg from "../../../../../../../../icons/gravity-ui/bin.svg.js"
import type {Tag} from "../../../../../../../../../context/parts/tags/types.js"

type Actions = {
	color: (value: string) => void
	rename: (value: string) => boolean
	remove: () => void
}

export function renderTagRow(tag: Tag, actions: Actions) {

	const rename = (event: Event) => {
		const input = event.currentTarget as HTMLElementTagNameMap["wa-input"]
		if (!actions.rename((input.value ?? "").trim()))
			input.value = tag.label
	}

	return html`
		<div class="tag-row">
			<wa-button class="swatch" id=${`tag-color-${tag.id}`} size="small" appearance="plain"
				aria-label=${`Edit color for ${tag.label}`}
				title=${tag.color ? `Change ${tag.label} color` : "No color"}>
				<span class="color-dot" ?data-colorless=${!tag.color}
					style=${`background-color: ${tag.color ?? "transparent"}`}>
				</span>
			</wa-button>
			<wa-popover for=${`tag-color-${tag.id}`} placement="right-start">
				${renderColorEditor(tag.color ?? "", `Color for ${tag.label}`, actions.color)}
			</wa-popover>
			<wa-input class="tag-name" size="small" aria-label="Tag name"
				.value=${tag.label} @change=${rename}>
			</wa-input>
			<wa-button class="delete" size="small" appearance="plain"
				title=${`Delete ${tag.label}`} aria-label=${`Delete ${tag.label}`} @click=${actions.remove}>
				${binSvg}
			</wa-button>
		</div>
	`
}

