import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"
import zoomInSvg from "../../../../icons/material-design-icons/zoom-in.svg.js"
import zoomOutSvg from "../../../../icons/material-design-icons/zoom-out.svg.js"

export const Toolbar = shadow_view({styles}, use => () => {
	const actions = use.context.actions.timeline_actions

	return html`
		<div class="toolbar">
			<span @click=${actions.zoom_in} class="zoom-in">${zoomInSvg}</span>
			<span @click=${actions.zoom_out} class="zoom-out">${zoomOutSvg}</span>
		</div>
	`
})
