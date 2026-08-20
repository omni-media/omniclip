
import {html} from "lit"
import type {ExportProgress as RenderProgress} from "@omnimedia/omnitool/x/timeline/renderers/export/produce.js"

export type ExportProgress = {
	phase: "rendering" | "saving" | "complete" | "error"
	render?: RenderProgress
	error?: string
}

export function renderExportProgress(
	progress: ExportProgress,
	canvas: HTMLCanvasElement,
	onClose: () => void,
) {
	const complete = progress.phase === "complete"
	const error = progress.phase === "error"
	const percent = Math.round((progress.render?.ratio ?? 0) * 100)

	const label = complete
		? "Export complete"
		: error
			? "Export failed"
			: progress.phase === "saving"
				? "Saving file…"
				: `Rendering video… ${percent}%`

	return html`
		<div class="export-progress">
			<div class="export-progress-canvas-wrapper">
				${canvas}
			</div>

			<div class="export-progress-status" data-error=${error}>
				<span class="export-progress-icon">${complete ? "✓" : error ? "!" : ""}</span>
				<span>${label}</span>
			</div>
			${complete || error
				? html`<p>${error ? progress.error : "Your video is ready."}</p>`
				: html`
					<div class="export-progress-track">
						<div class="export-progress-fill" style="width: ${progress.phase === 'saving' ? 100 : percent}%"></div>
					</div>
				`}
			<wa-button
				class="export-progress-close"
				variant="neutral"
				?disabled=${!complete && !error}
				@click=${onClose}
			>
				${complete || error ? "Close" : "Exporting…"}
			</wa-button>
		</div>
	`
}

