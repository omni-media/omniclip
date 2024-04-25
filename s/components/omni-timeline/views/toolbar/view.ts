import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"
import scissorsSvg from "../../../../icons/gravity-ui/scissors.svg.js"
import undoSvg from "../../../../icons/material-design-icons/undo.svg.js"
import redoSvg from "../../../../icons/material-design-icons/redo.svg.js"
import zoomInSvg from "../../../../icons/material-design-icons/zoom-in.svg.js"
import {convert_ms_to_hmsms} from "../time-ruler/utils/convert_ms_to_hmsms.js"
import zoomOutSvg from "../../../../icons/material-design-icons/zoom-out.svg.js"

export const Toolbar = shadow_view(use => () => {
	use.styles(styles)
	use.watch(() => use.context.state.timeline)
	const actions = use.context.actions.timeline_actions
	const zoom = use.context.state.timeline.zoom
	const controller = use.context.controllers.timeline

	return html`
		<div class="toolbar">
			<div class=tools>
				<div class=history>
					<button ?data-past=${use.context.history.past.length !== 0} @click=${() => use.context.undo(use.context.state.timeline)}>${undoSvg}</button>
					<button ?data-future=${use.context.history.future.length !== 0} @click=${() => use.context.redo(use.context.state.timeline)}>${redoSvg}</button>
					<button @click=${() => controller.split(use.context.state.timeline, use.context.controllers.compositor)} class="split">${scissorsSvg}</button>
				</div>
				<div>${convert_ms_to_hmsms(use.context.state.timeline.timecode)}</div>
				<div class="zoom">
					<button ?disabled=${zoom >= 2} @click=${actions.zoom_in} class="zoom-in">${zoomInSvg}</button>
					<button ?disabled=${zoom <= -13} @click=${actions.zoom_out} class="zoom-out">${zoomOutSvg}</button>
				</div>
			</div>
		</div>
	`
})
