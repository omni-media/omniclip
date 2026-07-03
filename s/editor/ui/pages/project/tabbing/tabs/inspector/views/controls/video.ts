
import {html} from "lit"
import {shadow, useCss} from "@e280/sly"
import {Item} from "@omnimedia/omnitool"

import {RoleControls} from "./role.js"
import {CropControls} from "./crop/view.js"
import {controlsStyles} from "./styles.css.js"
import {FiltersControls} from "./filters/view.js"
import {CaptionsControls} from "./captions/view.js"
import {TransformControls} from "./transform/view.js"
import {KeyframesControls} from "./keyframes/view.js"
import {AnimationsControls} from "./animations/view.js"
import {CompositingControls} from "./compositing/view.js"
import {ItemControlTabs, itemControlTabsCss} from "./control-tabs.js"
import {EditorContext} from "../../../../../../../../context/context.js"

export const VideoControls = shadow((context: EditorContext, item: Item.Video) => {
	useCss(controlsStyles, itemControlTabsCss)

	const properties = html`
		${RoleControls(context, item)}
		<div class="controls-group">
			<h4 class="heading">Transform</h4>
			${TransformControls(context, item)}
		</div>
		<div class="controls-group">
			${KeyframesControls(context, item)}
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
			effects: html`
				${FiltersControls(context, item)}
				${AnimationsControls(context, item)}
			`,
			ai: html`
				${CaptionsControls(context, item)}
			`,
		})}
	`
})

