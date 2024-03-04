import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"
import exportSvg from "../../../../icons/gravity-ui/export.svg.js"
import zoomInSvg from "../../../../icons/material-design-icons/zoom-in.svg.js"
import zoomOutSvg from "../../../../icons/material-design-icons/zoom-out.svg.js"
import {convert_ms_to_hmsms} from "../time-ruler/utils/convert_ms_to_hmsms.js"

export const Toolbar = shadow_view({styles}, use => () => {
	use.watch(() => use.context.state.timeline)
	const actions = use.context.actions.timeline_actions
	const zoom = use.context.state.timeline.zoom
	const video_export = use.context.controllers.video_export
	const state = use.context.state.timeline

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
							<span class="status">Progress ${state.export_status === "complete" || state.export_status === "flushing"
								? "100"
								: state.export_progress.toFixed(2)}
								%</span>
							<span>Status: ${state.export_status}</span>
							<span>FPS: ${state.fps}</span>
						</div>
						<button
							@click=${() => video_export.save_file()}
							class="download"
							.disabled=${state.export_status !== "complete"}
						>
							Download
						</button>
					</div>
				</div>
			</dialog>
			<button class="export-button" @click=${() => video_export.export_start(use.context.state.timeline)}>${exportSvg}<span>Export</span></button>
			<div>${convert_ms_to_hmsms(use.context.state.timeline.timecode)}</div>
			<div class="zoom">
				<button ?disabled=${zoom >= 2} @click=${actions.zoom_in} class="zoom-in">${zoomInSvg}</button>
				<button ?disabled=${zoom <= -13} @click=${actions.zoom_out} class="zoom-out">${zoomOutSvg}</button>
			</div>
		</div>
	`
})
