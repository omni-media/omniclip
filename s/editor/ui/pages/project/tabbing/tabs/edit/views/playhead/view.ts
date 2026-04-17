import {html} from "lit"
import {shadow, useCss} from "@e280/sly"

import styleCss from "./style.css.js"
import {EditorContext} from "../../../../../../../../context/context.js"
import playheadSvg from "../../../../../../../icons/remix-icon/playhead.svg.js"

export const Playhead = shadow((context: EditorContext) => {
	useCss(styleCss)
	const session = context.session

	return html`
		<div class="playhead" style="left: ${session.$playhead.value}px">
			${playheadSvg}
			<div class="line"></div>
		</div>
	`
})
