import {Op, html, watch} from "@benev/slate"

import {VideoEffect} from "../../../../context/types.js"
import {Tooltip} from "../../../../views/tooltip/view.js"
import xMarkSvg from "../../../../icons/gravity-ui/x-mark.svg.js"
import {tooltipStyles} from "../../../../views/tooltip/styles.js"
import exportSvg from "../../../../icons/gravity-ui/export.svg.js"
import {StateHandler} from "../../../../views/state-handler/view.js"
import {collaboration, shadow_view} from "../../../../context/context.js"
import circleInfoSvg from "../../../../icons/gravity-ui/circle-info.svg.js"
import {confirmModalStyles, exportOverlayStyles, styles} from "./styles.js"

export const Export = shadow_view(use => () => {
	use.styles([styles, tooltipStyles])
	use.watch(() => use.context.state)

	const state = use.context.state
	const video_export = use.context.controllers.video_export
	const [logs, setLogs, getLogs] = use.state<string[]>([])

	use.mount(() => {
		const dispose = collaboration.onChange(() => use.rerender())
		return () => dispose()
	})
	const isClient = collaboration.client

	use.mount(() => {
		const dispose = watch.track(() => use.context.state.log, (log) => {
			if(getLogs().length === 20) {
				const new_arr = getLogs().slice(1)
				setLogs(new_arr)
			}
			setLogs([...getLogs(), log])
		})
		return () => dispose()
	})

	const renderAspectRatio = () => {
		const aspectRatio = state.settings.aspectRatio
		return html`
			<div class=aspect-ratios>
				<h4>Aspect Ratio</h4>
				<div class=cnt>
					<div class="shape" style="aspect-ratio: ${aspectRatio}"></div>
					<div class=info>
						${aspectRatio === "21/9"
							? "Ultra-Wide"
							: aspectRatio === "9/16"
							?  "Vertical"
							: aspectRatio === "16/9"
							? "Wide"
							: aspectRatio === "1/1"
							? "Square"
							: aspectRatio === "4/3"
							? "Standard"
							: aspectRatio === "3/2"
							? "Balanced"
							: null}
						</div>
					<div class=aspect-ratio>${aspectRatio}</div>
				</div>
			</div>
		`
	}

	return StateHandler(Op.all(
		use.context.helpers.ffmpeg.is_loading.value,
		use.context.is_webcodecs_supported.value), () => html`
		<div class="flex">
			<div class=export>
				<h2>Export</h2>
				<p>${circleInfoSvg} Your video will export with the following settings:</p>
				<div class=selected-settings>
					${renderAspectRatio()}
					<div>
						<h4>Resolution</h4>
						<span>${state.settings.width}x${state.settings.height} (${state.settings.standard})</span>
					</div>
					<div>
						<h4>Timebase</h4>
						<span>${state.timebase} fps</span>
					</div>
					<div>
						<h4>Bitrate</h4>
						<span>${state.settings.bitrate} kbps</span>
					</div>
					${Tooltip(
						html`
							<button
								?disabled=${state.settings.bitrate <= 0 || isClient}
								class="sparkle-button"
								@click=${() => video_export.export_start(use.context.state, state.settings.bitrate)}
							>
								<span class="text">${exportSvg}<span>Export</span></span>
							</button>
						`,
						html`${isClient ?  "Only host can export" : null}`
					)}
				</div>
			</div>
		</div>
	`)
})

export const ExportInProgressOverlay = shadow_view((use) => () => {
	use.styles([exportOverlayStyles])
	use.watch(() => use.context.state)

	const state = use.context.state
	const videoExport = use.context.controllers.video_export

	// Format progress to 2 decimal places
	const formattedProgress =
		state.export_status === "complete" || state.export_status === "flushing"
			? 100
			: Number.parseFloat(state.export_progress.toFixed(2))

	// Get status text for display
	const getStatusText = () => {
		switch (state.export_status) {
			// case "preparing":
			//   return "Preparing export..."
			case "composing":
				return "Exporting video..."
			case "flushing":
				return "Finalizing export..."
			case "complete":
				return "Export complete!"
			case "error":
				return "Export failed"
			default:
				return "Processing..."
		}
	}

	// Get variant for progress bar
	const getProgressVariant = () => {
		if (state.export_status === "error") return "danger"
		if (state.export_status === "complete") return "success"
		return "primary"
	}

	const handleSaveButtonMouseOver = () => {
		if (state.export_status === "complete") {
			use.rerender()
		}
	}

	const handleSaveButtonMouseOut = () => {
		use.rerender()
	}

	// Update visibility class and body scroll
	if (state.is_exporting) {
		use.element.classList.add("visible")
		document.body.style.overflow = "hidden"
	} else {
		use.element.classList.remove("visible")
		document.body.style.overflow = ""
	}

	return html`
		<div class="overlay-backdrop"></div>
		<div class="overlay-container">
			<div class="export-container">
				${
					state.is_exporting
						? html`
					<div class="preview-container">
						${use.context.controllers.compositor.app.view}
					</div>
				`
						: ""
				}
				
				<div class="progress-container">
					<div class="status-header">
						<h2>
							${
								state.export_status === "complete"
									? html`
								<sl-icon name="check-circle-fill" class="status-icon success"></sl-icon>
								Export Complete
							`
									: state.export_status === "error"
										? html`
								<sl-icon name="exclamation-circle-fill" class="status-icon error"></sl-icon>
								Export Failed
							`
										: html`
								<sl-spinner class="status-icon"></sl-spinner>
								Exporting Video
							`
							}
						</h2>
					</div>
					
					<div class="progress-stats">
						<span class="percentage">${formattedProgress}%</span>
						<span class="status-text">${getStatusText()}</span>
					</div>
					
					<sl-progress-bar 
						value=${formattedProgress} 
						variant=${getProgressVariant()}
						class="export-progress-bar"
					></sl-progress-bar>
					
					<div class="action-buttons">
						<sl-button 
							variant="default" 
							size="large" 
							@click=${() => {
								videoExport.resetExporter(use.context.state)
							}}
						>
							${state.export_status === "complete" ? "Continue Editing" : "Cancel Export"}
						</sl-button>
						
						<sl-button 
							variant="primary" 
							size="large" 
							?disabled=${state.export_status !== "complete"}
							@click=${() => videoExport.save_file()}
							class="save-button"
							@mouseover=${handleSaveButtonMouseOver}
							@mouseout=${handleSaveButtonMouseOut}
						>
							<sl-icon slot="prefix" name="download"></sl-icon>
							Save Video
						</sl-button>
					</div>
				</div>
			</div>
		</div>
	`
})

export const ExportConfirmModal = shadow_view(use => (showModal: boolean, setShowModal: (v: boolean) => void) => {
	use.watch(() => use.context.state)
	use.styles([confirmModalStyles])
	const mediaController = use.context.controllers.media
	const [_, setFilesProgess, getFileProgress] = use.state<Map<string, number>>(new Map())

	// get proxy videos on timeline
	const getProxies = () => {
		const files = [...mediaController.values()]
		return files.filter(file => file.kind === "video" && file.proxy && use.context.state.effects.some(e => e.kind === "video" && e.file_hash === file.hash))
	}

	use.mount(() => {
		const dispose = mediaController.on_media_change(() => use.rerender())
		const dispose1 = collaboration.onFileProgress(({hash, progress}) => {
			setFilesProgess(new Map(getFileProgress()).set(hash, progress))
		})
		return () => {dispose(); dispose1()}
	})

	const dialog = use.defer(() => use.shadow.querySelector("dialog"))
	if(showModal) {
		dialog?.showModal()
	} else {
		dialog?.close()
	}

	const getProxyPreview = (hash: string) => {
		return (use.context.state.effects.find(e => e.kind === "video" && e.file_hash === hash) as VideoEffect).thumbnail
	}

	const getFileMetadata = (hash: string) => {
		return collaboration.filesMetada.find(([fileHash]) => hash === fileHash)?.[1]
	}

	const renderProxyFilesInProgressModal = () => {
		return html`
			<div>
				<div class=flex>
					<h4>Export Unavailable</h4>
					<button @click=${() => setShowModal(false)} class="close-modal">${xMarkSvg}</button>
				</div>
				<p>We're still transferring the following files to you.<br>
					Please wait until all transfers are complete before exporting the project.
				</p>
				<div class=in-progress>
				<h5>Pending files:</h5>
					${getProxyFilesInProgress.map(([hash, file]) => html`
						<div class=file-progress>
							<span>${getFileMetadata(hash)?.name}</span>
							<span>Progress: ${((file.received/file.total) * 100).toFixed()}%</span>
						</div>
					`)}
				</div>
			</div>
		`
	}

	const renderProjectReadyModal = () => {
		return html`
			<div class=flex>
				<h4>Your project is ready</h4>
				<button @click=${() => setShowModal(false)} class="close-modal">${xMarkSvg}</button>
			</div>
			<p>All files have been transferred without proxies.<br>
				You can now export your project in the highest quality.
			</p>
			<button
				class="export-button"
				@click=${() => {
					use.context.controllers.video_export.export_start(use.context.state, use.context.state.settings.bitrate)
					setShowModal(false)
				}}
			>
				Export
			</button>
		`
	}

	const renderRequestOriginalFilesModal = () => {
		return html`
			<div class=flex>
				<h4>Proxy Videos Detected</h4>
				<button @click=${() => setShowModal(false)} class="close-modal">${xMarkSvg}</button>
			</div>
			<p>To ensure faster transfers within collaborative environment, some of your videos are proxies (same resolution, lower bitrate):</p>
			<h4>Export options:</h4>
			<ol class=options>
				<li>
					<div class=option>
						<span>Export with proxies</span>
						<button
							class="export-button"
							@click=${() => {
								setShowModal(false)
								use.context.controllers.video_export.export_start(use.context.state, use.context.state.settings.bitrate)
							}}
						>
							Export
						</button>
					</div>
				</li>
				<li>Request original videos:</li>
			</ol>
			<div class=proxies>
				${getProxies().map(proxy => html`
					<div class=proxy>
						<img src=${getProxyPreview(proxy.hash)}>
						<span>${proxy?.file.name}</span>
						<button class="request" @click=${() => collaboration.requestOriginalVideoFile(proxy!.hash)}>
							${getFileProgress().get(proxy.hash) === 100 ? "Request" : `${getFileProgress().get(proxy.hash)?.toFixed()}%`}
						</button>
					</div>
				`)}
			</div>
		`
	}

	const getProxyFilesInProgress = collaboration.filesInProgress.filter(([_, file]) => file.proxy === true)

	return html`
		<dialog>
			<div>
			${getProxyFilesInProgress.length !== 0
				? renderProxyFilesInProgressModal()
				: getProxies().length !== 0
					? renderRequestOriginalFilesModal()
					: renderProjectReadyModal()
			}
			</div>
		</dialog>
	`
})
