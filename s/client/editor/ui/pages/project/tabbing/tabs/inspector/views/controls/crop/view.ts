import {html} from "lit"
import {shadow, useCss} from "@e280/sly"
import {Item} from "@omnimedia/omnitool"

import styleCss from "./style.css.js"
import {controlsStyles} from "../styles.css.js"
import {EditorContext} from "../../../../../../../../../context/context.js"

import "@awesome.me/webawesome/dist/components/number-input/number-input.js"

export const CropControls = shadow((context: EditorContext, item: Item.Any) => {
	useCss(controlsStyles, styleCss)

	const itemsMap = new Map(context.strata.timeline.state.items.map(i => [i.id, i]))

	const spatialItem = "spatialId" in item && item.spatialId !== undefined
		? itemsMap.get(item.spatialId) as Item.Spatial
		: null

	// const crop = spatialItem?.crop ?? [0, 0, 0, 0]
	const [top, right, bottom, left] = [0, 0, 0, 0]

	const handleCropChange = (side: "top" | "right" | "bottom" | "left", value: number) => {
		// propertiesController.updateCrop(item.id, {[side]: value})
	}

	const cropInput = (side: "top" | "right" | "bottom" | "left", value: number) => html`
		<wa-number-input
			class="crop-input"
			size="small"
			without-steppers
			placeholder=${side}
			.value=${String(value)}
			@input=${(e: Event) => handleCropChange(side, Number((e.target as HTMLInputElement).value))}
		>
			<span slot="start" class="prefix">${side}</span>
		</wa-number-input>
	`

	return html`
		<div class="crop-controls">
			<div class="grid">
				${cropInput("top", top)}
				${cropInput("left", left)}
				${cropInput("right", right)}
				${cropInput("bottom", bottom)}
			</div>
		</div>
	`
})
