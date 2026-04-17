
import {html} from "lit"
import {shadow, useCss} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../../../../../../theme.css.js"
import {TimelineArea} from "./views/timeline/view.js"
import {EditorContext} from "../../../../../../context/context.js"

export const EditTab = shadow((context: EditorContext) => {
	useCss(themeCss, styleCss)

	return html`
		${TimelineArea(context)}
	`
})
