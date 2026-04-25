
import {html} from "lit"
import {shadow, useCss} from "@e280/sly"
import {Item} from "@omnimedia/omnitool"

import {ItemControlTabs} from "./control-tabs.js"
import {FiltersControls} from "./filters/view.js"
import {CropControls} from "./crop/view.js"
import {sectionStyles} from "./styles.css.js"
import {TransformControls} from "./transform/view.js"
import {CompositingControls} from "./compositing/view.js"
import {EditorContext} from "../../../../../../../../context/context.js"

export const VideoControls = shadow((context: EditorContext, item: Item.Video) => {
	useCss(sectionStyles)

	const properties = html`
		<div class="controls-group">
			<h4 class="heading">Transform</h4>
			${TransformControls(context, item)}
		</div>
		<div class="controls-group">
			<h4 class="heading">Crop</h4>
			${CropControls(context, item)}
		</div>
		<div class="controls-group">
			<h4 class="heading">Compositing</h4>
			${CompositingControls(context, item as Item.Video)}
		</div>
	`

	return html`
		${ItemControlTabs({
			properties,
			effects: FiltersControls(context, item),
		})}
	`
})

