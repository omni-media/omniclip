import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"
import exportSvg from "../../../../icons/gravity-ui/export.svg.js"
import zoomInSvg from "../../../../icons/material-design-icons/zoom-in.svg.js"
import zoomOutSvg from "../../../../icons/material-design-icons/zoom-out.svg.js"

export const Toolbar = shadow_view({styles}, use => () => {
	const actions = use.context.actions.timeline_actions
	const zoom = use.context.state.timeline.zoom
	const video_export = use.context.controllers.video_export

	return html`
		<div class="toolbar">
			<button class="export-button" @click=${() => video_export.export_start(use.context.state.timeline)}>${exportSvg}<span>Export</span></button>
			<div class="zoom">
				<button ?disabled=${zoom === -1} @click=${actions.zoom_in} class="zoom-in">${zoomInSvg}</button>
				<button @click=${actions.zoom_out} class="zoom-out">${zoomOutSvg}</button>
			</div>
		</div>
	`
})
