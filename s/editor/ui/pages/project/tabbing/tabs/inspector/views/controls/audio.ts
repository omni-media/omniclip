import {html} from "lit"
import {shadow, useCss} from "@e280/sly"
import {Item} from "@omnimedia/omnitool"

import {sectionStyles} from "./styles.css.js"
import {CaptionsControls} from "./captions/view.js"
import {ItemControlTabs, itemControlTabsCss} from "./control-tabs.js"
import {EditorContext} from "../../../../../../../../context/context.js"

export const AudioControls = shadow((context: EditorContext, item: Item.Audio) => {
	useCss(sectionStyles, itemControlTabsCss)

	const properties = html`
		<div class="controls-group">
			<h4 class="heading">Volume & Pan</h4>
			<p>Volume and Panning controls for item ${item.id} will go here.</p>
		</div>
	`

	return html`
		${ItemControlTabs({
			properties,
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
