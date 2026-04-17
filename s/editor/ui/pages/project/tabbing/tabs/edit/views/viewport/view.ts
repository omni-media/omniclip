import {html} from "lit"
import {shadow, useCss} from "@e280/sly"

import styleCss from "./style.css.js"
import {Toolbar} from "../toolbar/view.js"
import {EditorContext} from "../../../../../../../../context/context.js"
import themeCss from "../../../../../../../../theme.css.js"

export const TimelineViewport = shadow((context: EditorContext) => {
	useCss(themeCss, styleCss)
	const player = context.controllers.player

	return html`
		<div class=viewport>
			${player.canvas}
			${Toolbar(context)}
		</div>
	`
})


