import {html} from "lit"
import {shadow, useCss} from "@e280/sly"
import {Item, Kind} from "@omnimedia/omnitool"

import styleCss from "./style.css.js"
import {controlsStyles} from "../styles.css.js"
import type {Idx} from "../../../../../../../../logic/parts/index.js"
import {add, update} from "../../../../../../../../logic/parts/mutate.js"
import {EditorContext} from "../../../../../../../../../context/context.js"

import "@awesome.me/webawesome/dist/components/option/option.js"
import "@awesome.me/webawesome/dist/components/select/select.js"
import "@awesome.me/webawesome/dist/components/slider/slider.js"

const BLEND_MODES = [
	"Normal", "Multiply", "Screen", "Overlay", "Darken", "Lighten",
	"ColorDodge", "ColorBurn", "HardLight", "SoftLight", "Difference",
	"Exclusion", "Hue", "Saturation", "Color", "Luminosity"
]

export const CompositingControls = shadow((context: EditorContext, item: Idx.VideoItem | Item.Image | Item.Text) => {
	useCss(controlsStyles, styleCss)
	const findAlphaFilter = () => (item.filterIds ?? [])
		.map(id => context.session.index.items.get(id))
		.find((candidate): candidate is Item.Filter<"AlphaFilter"> =>
			candidate?.kind === Kind.Filter && candidate.type === "AlphaFilter")
	let alphaFilter = findAlphaFilter()
	const opacity = alphaFilter?.enabled === false ? 1 : alphaFilter?.params?.alpha ?? 1
	const blendMode = "Normal"

	const handleOpacityChange = (value: number) => {
		if (!Number.isFinite(value)) return

		const alpha = Math.min(1, Math.max(0, value))

		if (alphaFilter) {
			const filter = alphaFilter
			context.strata.timeline.mutate(state => {
				update(state, filter.id, {params: {...filter.params, alpha}, enabled: true})
			})
			return
		}

		if (alpha === 1) return

		const filter: Item.Filter<"AlphaFilter"> = {
			id: context.omni.getId(),
			kind: Kind.Filter,
			type: "AlphaFilter",
			params: {alpha},
			enabled: true,
		}
		alphaFilter = filter

		context.strata.timeline.mutate(state => {
			add(state, filter)
			update(state, item.id, {filterIds: [...(item.filterIds ?? []), filter.id]})
		})
	}

	const handleSliderInput = (event: Event) => {
		const slider = event.target as HTMLElementTagNameMap["wa-slider"]
		handleOpacityChange(Number(slider.value))
	}

	const handleNumberInput = (event: Event) => {
		const input = event.target as HTMLInputElement
		if (Number.isFinite(input.valueAsNumber))
			handleOpacityChange(input.valueAsNumber / 100)
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
					<wa-slider
						id="opacity"
						size="small"
						min="0"
						max="1"
						step="0.01"
						.value=${opacity}
						@input=${handleSliderInput}
					></wa-slider>
					<div class="input-group">
						<input
							type="number"
							min="0"
							max="100"
							step="1"
							.value=${Math.round(opacity * 100).toString()}
							@input=${handleNumberInput}
						>
						<span class="suffix">%</span>
					</div>
				</div>
			</div>
		</div>
	`
})
