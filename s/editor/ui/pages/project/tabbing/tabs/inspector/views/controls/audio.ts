
import {css, html} from "lit"
import {shadow, useCss} from "@e280/sly"
import {Item} from "@omnimedia/omnitool"

import {valueOf} from "./filters/utils.js"
import {controlsStyles} from "./styles.css.js"
import {CaptionsControls} from "./captions/view.js"
import type {Idx} from "../../../../../../../logic/parts/index.js"
import {ItemControlTabs, itemControlTabsCss} from "./control-tabs.js"
import {EditorContext} from "../../../../../../../../context/context.js"

export const audioStyles = css`
.audio-controls {
	display: flex;
	flex-direction: column;
	gap: 0.75em;
}

.audio-row {
	display: grid;
	grid-template-columns: 4.5em minmax(0, 1fr) 5em;
	align-items: center;
	gap: 0.6em;
}

.audio-row label {
	color: #aaa;
	font-size: var(--font-size-xs);
}

.audio-row wa-slider {
	min-width: 0;
}

.audio-row wa-number-input {
	width: 100%;
}

.audio-actions {
	display: flex;
	gap: 0.5em;
}
`

export function AudioProperties(context: EditorContext, item: Idx.AudioItem) {
	const gain = item.gain ?? 1
	const volume = Math.round(gain * 100)

	const setVolume = (value: number) =>
		context.omni.set<Idx.AudioItem>(item.id, {gain: Math.max(0, value) / 100})

	return html`
		<div class="controls-group">
			<h4 class="heading">Audio</h4>
			<div class="audio-controls">
				<div class="audio-row">
					<label>Volume</label>
					<wa-slider
						size="small"
						min="0"
						max="200"
						step="1"
						.value=${volume}
						@input=${(e: Event) => setVolume(Number(valueOf(e)))}
					></wa-slider>
					<wa-number-input
						size="small"
						without-steppers
						min="0"
						max="200"
						step="1"
						suffix="%"
						.value=${String(volume)}
						@input=${(e: Event) => setVolume(Number(valueOf(e)))}
					></wa-number-input>
				</div>
				<div class="audio-actions">
					<wa-button size="small" variant="neutral" @click=${() => setVolume(0)}>Mute</wa-button>
					<wa-button size="small" variant="neutral" @click=${() => setVolume(100)}>Reset</wa-button>
				</div>
			</div>
		</div>
	`
}

export const AudioControls = shadow((context: EditorContext, item: Item.Audio) => {
	useCss(controlsStyles, itemControlTabsCss, audioStyles)

	return html`
		${ItemControlTabs({
			properties: AudioProperties(context, item),
			effects: html`
				<div class="controls-group">
					<p class="muted">Audio effects are not wired yet.</p>
				</div>
			`,
			ai: html`
				${CaptionsControls(context, item)}
			`,
		})}
	`
})

