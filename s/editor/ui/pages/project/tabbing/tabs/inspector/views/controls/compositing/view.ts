import {html} from "lit"
import {shadow, useCss} from "@e280/sly"
import {Item} from "@omnimedia/omnitool"

import styleCss from "./style.css.js"
import {controlsStyles} from "../styles.css.js"
import type {Idx} from "../../../../../../../../logic/parts/index.js"
import {EditorContext} from "../../../../../../../../../context/context.js"

import "@awesome.me/webawesome/dist/components/option/option.js"
import "@awesome.me/webawesome/dist/components/select/select.js"

const BLEND_MODES = [
	"Normal", "Multiply", "Screen", "Overlay", "Darken", "Lighten",
	"ColorDodge", "ColorBurn", "HardLight", "SoftLight", "Difference",
	"Exclusion", "Hue", "Saturation", "Color", "Luminosity"
]

export const CompositingControls = shadow((context: EditorContext, item: Idx.VideoItem | Item.Image | Item.Text) => {
	useCss(controlsStyles, styleCss)
	const timeline = context.strata.timeline.state.items

	const spatialItem = "spatialId" in item && item.spatialId !== undefined
		? timeline.find(i => i.id === item.spatialId) as Item.Spatial
		: null

	const opacity = 1
	const blendMode = "Normal"

	const handleOpacityChange = (value: number) => {
	}

	const handleBlendModeChange = (value: string) => {
	}

	return html`
		<div class="compositing-controls">
			<div class="control-row">
				<label for="blend-mode">Blend Mode</label>
				<wa-select
					id="blend-mode"
					size="small"
					class="blend-select"
					.value=${blendMode}
					@change=${(e: Event) => handleBlendModeChange((e.target as HTMLSelectElement).value)}
				>
					${BLEND_MODES.map(mode => html`<wa-option value=${mode}>${mode}</wa-option>`)}
				</wa-select>
			</div>
			<div class="control-row">
				<label for="opacity">Opacity</label>
				<div class="inputs">
					<input
						id="opacity"
						type="range"
						min="0"
						max="1"
						step="0.01"
						.value=${opacity.toString()}
						@input=${(e: InputEvent) => handleOpacityChange(Number((e.target as HTMLInputElement).value))}
					>
					<div class="input-group">
						<input
							type="number"
							min="0"
							max="100"
							step="1"
							.value=${Math.round(opacity * 100).toString()}
							@input=${(e: InputEvent) => handleOpacityChange(Number((e.target as HTMLInputElement).value) / 100)}
						>
						<span class="suffix">%</span>
					</div>
				</div>
			</div>
		</div>
	`
})

