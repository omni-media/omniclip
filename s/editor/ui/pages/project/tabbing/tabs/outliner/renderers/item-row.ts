
import {html} from "lit"
import {Item, Kind} from "@omnimedia/omnitool"

import {itemLabel} from "../../../../../../logic/utils/item-label.js"
import textSvg from "../../../../../../icons/gravity-ui/text.svg.js"
import starSvg from "../../../../../../icons/gravity-ui/star.svg.js"
import stackSvg from "../../../../../../icons/gravity-ui/bars.svg.js"
import sequenceSvg from "../../../../../../icons/gravity-ui/timeline.svg.js"
import starFillSvg from "../../../../../../icons/gravity-ui/star-fill.svg.js"
import videoPlayerSvg from "../../../../../../icons/carbon-icons/video-player.svg.js"

function renderIcon(kind: Kind) {
	switch (kind) {
		case Kind.Stack: return stackSvg
		case Kind.Sequence: return sequenceSvg
		case Kind.Video: return videoPlayerSvg
		case Kind.Clip: return videoPlayerSvg
		case Kind.Text: return textSvg
		default: return html`?`
	}
}

export function renderItemRow(props: {
	item: Item.Any
	selected: boolean
	starred: boolean
	onSelect: (id: number) => void
	onToggleStar: (id: number) => void
}) {
	const {item, selected, starred, onSelect, onToggleStar} = props
	const duration = (item as any).duration ? `${((item as any).duration / 1000).toFixed(2)}s` : "-"

	const select = () => onSelect(item.id)

	const toggleStar = (event: Event) => {
		event.stopPropagation()
		onToggleStar(item.id)
	}

	return html`
		<div
			class="item-row"
			?data-selected=${selected}
			@click=${select}
		>
			<span class="color-swatch"></span>
			<span class="icon">${renderIcon(item.kind)}</span>
			<span class="label">${itemLabel(item)}</span>
			<span class="duration">${duration}</span>

			<button
				class="star-button"
				?data-starred=${starred}
				@click=${toggleStar}
			>
				${starred ? starFillSvg : starSvg}
			</button>
		</div>
	`
}

