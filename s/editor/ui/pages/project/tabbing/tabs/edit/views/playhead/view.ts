import {html} from "lit"
import {view} from "@e280/sly"

import styleCss from "./style.css.js"
import {EditorContext} from "../../../../../../../../context/context.js"
import playheadSvg from "../../../../../../../icons/remix-icon/playhead.svg.js"

export const Playhead = view(use => (context: EditorContext) => {
	use.styles(styleCss)
	const core = context.omnicore

	return html`
		<div class="playhead" style="left: ${core.$playhead.value}px">
			${playheadSvg}
			<div class="line"></div>
		</div>
	`
})

