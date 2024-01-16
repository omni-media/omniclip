import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"
import exportSvg from "../../../../icons/gravity-ui/export.svg.js"
import zoomInSvg from "../../../../icons/material-design-icons/zoom-in.svg.js"
import zoomOutSvg from "../../../../icons/material-design-icons/zoom-out.svg.js"

export const Toolbar = shadow_view({styles}, use => () => {
	use.watch(() => use.context.state.timeline)
	const actions = use.context.actions.timeline_actions
	const zoom = use.context.state.timeline.zoom
	const video_export = use.context.controllers.video_export

	if(use.context.state.timeline.is_exporting) {
		const dialog = use.shadow.querySelector("dialog")
		dialog?.showModal()
	}

	return html`
		<div class="toolbar">
			<dialog>
				<div class="box">
					${video_export.canvas}
					<div class="flex-col">
						<div class="progress">
							<span>Progress</span>
							<span>${use.context.state.timeline.export_progress.toFixed(2)}%</span>
						</div>
						<button
							@click=${() => video_export.save_file()}
							class="download"
							.disabled=${use.context.state.timeline.export_progress <= 100}
						>
							Download
						</button>
					</div>
				</div>
			</dialog>
			<button class="export-button" @click=${() => video_export.export_start(use.context.state.timeline)}>${exportSvg}<span>Export</span></button>
			<div class="zoom">
				<button ?disabled=${zoom === -1} @click=${actions.zoom_in} class="zoom-in">${zoomInSvg}</button>
				<button @click=${actions.zoom_out} class="zoom-out">${zoomOutSvg}</button>
			</div>
		</div>
	`
})
