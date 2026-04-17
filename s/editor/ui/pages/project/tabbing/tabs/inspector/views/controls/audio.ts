import {html} from "lit"
import {shadow, useCss} from "@e280/sly"
import {Item} from "@omnimedia/omnitool"

import {sectionStyles} from "./styles.css.js"
import {EditorContext} from "../../../../../../../../context/context.js"

export const AudioControls = shadow((context: EditorContext, item: Item.Any) => {
	useCss(sectionStyles)

	return html`
		<div class="controls-group">
			<h4 class="heading">Volume & Pan</h4>
			<p>Volume and Panning controls for item ${item.id} will go here.</p>
		</div>
	`
})
