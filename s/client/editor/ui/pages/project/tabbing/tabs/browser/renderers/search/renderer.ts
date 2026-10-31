
import {html} from "lit"
import "@awesome.me/webawesome/dist/components/popover/popover.js"

import type {Progress} from "../../search/types.js"
import type {MediaSearch} from "../../search/controller.js"
import loadingSvg from "../../../../../../../icons/loading.svg.js"
import sparklesSvg from "../../../../../../../icons/sparkles.svg.js"
import playSvg from "../../../../../../../icons/gravity-ui/play.svg.js"
import pauseSvg from "../../../../../../../icons/gravity-ui/pause.svg.js"

export function createAiSearch(aiSearch: MediaSearch) {
	const toggleAiSearch = () => {
		if (aiSearch.enabled()) aiSearch.disable()
		else aiSearch.start()
	}

	const renderAiHeading = (enabled: boolean) => html`
		<div class="ai-heading">
			<strong>AI media search</strong>
			<button class="ai-switch" role="switch" aria-label="Enable AI media search"
				aria-checked=${String(enabled)} @click=${toggleAiSearch}>
				<span></span>
			</button>
		</div>
	`

	const renderAiTask = (enabled: boolean, progress: Progress) => {
		const downloading = enabled && progress.kind === "download"
		const indexing = enabled && progress.kind === "index"
		const paused = aiSearch.paused()
		const queue = aiSearch.queue()
		const showProgress = enabled && progress.total > 0

		return html`
			<div class="ai-task">
				<div class="ai-task-content">
					${indexing && queue.total ? html`
						<div class="ai-queue-count">${queue.completed} of ${queue.total} media indexed</div>
					` : ""}
					<strong>
						${enabled && progress.kind === "prepare" && !aiSearch.error() ? html`
							<span class="ai-loading" aria-hidden="true">${loadingSvg}</span>
						` : ""}
						${enabled ? progress.stage : "Download search model"}
					</strong>
					<div class="ai-progress-row">
						${showProgress ? html`
							<progress .value=${progress.loaded} .max=${progress.total}></progress>
						` : downloading ? html`<progress></progress>` : ""}
						${indexing ? html`
							<button class="ai-pause"
								aria-label=${paused ? "Resume indexing" : "Pause indexing"}
								title=${paused ? "Resume indexing" : "Pause indexing"}
								@click=${() => paused ? aiSearch.resume() : aiSearch.pause()}>
								${paused ? playSvg : pauseSvg}
							</button>
						` : ""}
					</div>
					${!enabled || downloading ? html`
						<div class="ai-task-meta" role="status">
							${enabled
								? `${Math.round(progress.loaded / 1_000_000)} MB downloaded${progress.total ? ` of ${Math.round(progress.total / 1_000_000)} MB` : ""}`
								: "About 485 MB on first use"}
						</div>
					` : ""}
				</div>
			</div>
		`
	}

	const renderAiPanel = (enabled: boolean) => {
		const progress = aiSearch.progress()
		const showTask = (enabled && progress.kind !== "idle") || !aiSearch.modelDownloaded()

		return html`
			<div class="ai-search-status">
				${renderAiHeading(enabled)}
				<p>Find media by describing what you see or hear.</p>
				${showTask ? renderAiTask(enabled, progress) : ""}
				${aiSearch.error() ? html`<p role="alert">${aiSearch.error()}</p>` : ""}
				${aiSearch.notice() ? html`<p>${aiSearch.notice()}</p>` : ""}
				${aiSearch.error() && enabled ? html`
					<button class="ai-retry" @click=${() => aiSearch.start()}>Retry</button>
				` : ""}
			</div>
		`
	}

	const renderAiSearch = () => {
		const enabled = aiSearch.enabled()
		return html`
			<button id="media-ai-search" class="ai-search-toggle" title="AI media search"
				aria-label="AI media search" aria-haspopup="dialog" ?data-active=${enabled}>
				${sparklesSvg}
			</button>
			<wa-popover for="media-ai-search" placement="bottom-start">
				${renderAiPanel(enabled)}
			</wa-popover>
		`
	}

	return renderAiSearch
}

