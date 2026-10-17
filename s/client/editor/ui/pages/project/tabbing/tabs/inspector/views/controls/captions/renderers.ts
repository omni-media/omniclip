
import {html} from "lit"
import {TextStyleOptions} from "pixi.js"
import {Item, Transcription} from "@omnimedia/omnitool"

import {formatRange, makePreview} from "./utils.js"
import {renderFillDetails} from "../text/details/fill.js"
import {renderFontDetails} from "../text/details/font.js"
import {renderLayoutDetails} from "../text/details/layout.js"
import {renderStrokeDetails} from "../text/details/stroke.js"
import {renderMultilineDetails} from "../text/details/multiline.js"
import {renderDropShadowDetails} from "../text/details/dropshadow.js"
import {TEXT_STYLE_DEFAULTS, TEXT_STYLE_OPTIONS} from "../../../../edit/constants.js"

export function renderTranscriptPreview(transcript: Transcription | null, maxChars: number) {
	if(transcript) {
		const preview = makePreview(transcript, maxChars).slice(0, 3)
		return html`
			<div class="preview-list">
				${preview.map(seg => html`
					<div class="preview-row">
						<span class="preview-time">${formatRange(seg.timestamp)}</span>
						<span class="preview-text">${seg.text}</span>
					</div>
				`)}
			</div>
		`
	} else return html`<p class="muted">Generate subtitles to preview transcript timing.</p>`
}

	export function renderCaptionStyleControls(
		styleItem: Item.TextStyle | undefined,
		update: (item: Item.TextStyle, opts: TextStyleOptions) => void
	) {
	if(styleItem) {
		const styleProps = {
			options: TEXT_STYLE_OPTIONS,
			style: {...TEXT_STYLE_DEFAULTS, ...styleItem.style},
			update: (opts: TextStyleOptions) => update(styleItem, opts)
		}
		return html`
			<div class="caption-style-controls">
				${renderFontDetails(styleProps)}
				${renderFillDetails(styleProps)}
				${renderMultilineDetails(styleProps)}
				${renderDropShadowDetails(styleProps)}
				${renderLayoutDetails(styleProps)}
				${renderStrokeDetails(styleProps)}
			</div>
		`
	}

	return html`<p class="muted">Generate subtitles to style captions.</p>`
}

