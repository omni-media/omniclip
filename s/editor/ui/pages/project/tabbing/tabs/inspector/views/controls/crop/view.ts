import {html} from "lit"
import {shadow, useCss} from "@e280/sly"
import {Item} from "@omnimedia/omnitool"

import styleCss from "./style.css.js"
import {controlsStyles} from "../styles.css.js"
import {EditorContext} from "../../../../../../../../../context/context.js"

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

	return html`
		<div class="crop-controls">
			<div class="grid">
				<div></div>
				<div class="input-group">
					<span class="prefix">TOP</span>
					<input
						type="number"
						placeholder="Top"
						.value=${top.toString()}
						@input=${(e: InputEvent) => handleCropChange("top", Number((e.target as HTMLInputElement).value))}
					>
				</div>
				<div></div>

				<div class="input-group">
					<span class="prefix">LEFT</span>
					<input
						type="number"
						placeholder="Left"
						.value=${left.toString()}
						@input=${(e: InputEvent) => handleCropChange("left", Number((e.target as HTMLInputElement).value))}
					>
				</div>
				<div class="input-group">
					<span class="prefix">RIGHT</span>
					<input
						type="number"
						placeholder="Right"
						.value=${right.toString()}
						@input=${(e: InputEvent) => handleCropChange("right", Number((e.target as HTMLInputElement).value))}
					>
				</div>

				<div></div>
				<div class="input-group">
					<span class="prefix">BOTTOM</span>
					<input
						type="number"
						placeholder="Bottom"
						.value=${bottom.toString()}
						@input=${(e: InputEvent) => handleCropChange("bottom", Number((e.target as HTMLInputElement).value))}
					>
				</div>
				<div></div>
			</div>
		</div>
	`
})
