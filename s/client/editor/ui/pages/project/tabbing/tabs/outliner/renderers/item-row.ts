
import {html} from "lit"
import {Item, Kind} from "@omnimedia/omnitool"

import imageSvg from "../../../../../../icons/image.svg.js"
import textSvg from "../../../../../../icons/gravity-ui/text.svg.js"
import {itemLabel} from "../../../../../../logic/utils/item-label.js"
import stackSvg from "../../../../../../icons/gravity-ui/bars.svg.js"
import captionsSvg from "../../../../../../icons/speech-to-text.svg.js"
import audioSvg from "../../../../../../icons/gravity-ui/volume.svg.js"
import sequenceSvg from "../../../../../../icons/gravity-ui/timeline.svg.js"
import videoPlayerSvg from "../../../../../../icons/carbon-icons/video-player.svg.js"

function renderIcon(kind: Kind) {
	switch (kind) {
		case Kind.Stack: return stackSvg
		case Kind.Sequence: return sequenceSvg
		case Kind.Video:
		case Kind.Clip: return videoPlayerSvg
		case Kind.Audio: return audioSvg
		case Kind.Text: return textSvg
		case Kind.Caption: return captionsSvg
		case Kind.Image: return imageSvg
		default: return html`?`
	}
}

function renderRuleHint(kinds?: readonly Kind[]) {
	if (!kinds?.length) return html`<span></span>`

	const hint = `Accepted kinds: ${kinds.map(kind => Kind[kind]).join(", ")}`
	return html`<span class="scope-icon" title=${hint} aria-label=${hint}>${kinds.map(renderIcon)}</span>`
}

export function renderItemRow(props: {
	item: Item.Any
	color?: string
	durationMs: number
	acceptedKinds?: readonly Kind[]
	onToggleExpand?: () => void
}) {
	const {item, color, durationMs, acceptedKinds, onToggleExpand} = props
	const duration = `${(durationMs / 1000).toFixed(2)}s`

	return html`
		<div class="item-row" @click=${onToggleExpand}>
			<span class="color-swatch" style=${color ? `background-color: ${color}` : ""}></span>
			<span class="icon">${renderIcon(item.kind)}</span>
			<span class="label">${itemLabel(item)}</span>
			${renderRuleHint(acceptedKinds)}
			<span class="duration">${duration}</span>
		</div>
	`
}

