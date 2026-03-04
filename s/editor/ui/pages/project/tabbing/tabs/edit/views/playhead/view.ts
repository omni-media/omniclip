import {html} from "lit"
import {view} from "@e280/sly"

import styleCss from "./style.css.js"
import {PIXELS_PER_MILLISECOND} from "../../constants.js"
import {EditorContext} from "../../../../../../../../context/context.js"
import playheadSvg from "../../../../../../../icons/remix-icon/playhead.svg.js"

export const Playhead = view(use => (context: EditorContext) => {
	use.styles(styleCss)

	const player = context.controllers.player
	const zoom = context.strata.settings.state.zoom
	const position = player.currentTime * PIXELS_PER_MILLISECOND * zoom

	return html`
		<div class="playhead" style="left: ${position}px">
			${playheadSvg}
			<div class="line"></div>
		</div>
	`
})

