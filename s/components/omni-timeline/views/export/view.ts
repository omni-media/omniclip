import {Op, html, watch, css} from "@benev/slate"

import {confirmModalStyles, styles} from "./styles.js"
import {VideoEffect} from "../../../../context/types.js"
import {Tooltip} from "../../../../views/tooltip/view.js"
import saveSvg from "../../../../icons/gravity-ui/save.svg.js"
import xMarkSvg from "../../../../icons/gravity-ui/x-mark.svg.js"
import {tooltipStyles} from "../../../../views/tooltip/styles.js"
import exportSvg from "../../../../icons/gravity-ui/export.svg.js"
import {StateHandler} from "../../../../views/state-handler/view.js"
import {collaboration, shadow_view} from "../../../../context/context.js"
import circleInfoSvg from "../../../../icons/gravity-ui/circle-info.svg.js"

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

export const ExportInProgressModal = shadow_view(use => () => {
	use.styles([styles, css`
		:host {
			display: block;
			width: auto;
			height: auto;
			overflow: auto;
			font-family: sans-serif;
		}`
	])
	use.watch(() => use.context.state)

	const state = use.context.state
	const compositor = use.context.controllers.compositor
	const video_export = use.context.controllers.video_export

	const dialog = use.defer(() => use.shadow.querySelector("dialog"))
	if(use.context.state.is_exporting) {
		dialog?.showModal()
	}

	return html`
		<dialog @cancel=${(e: Event) => e.preventDefault()}>
			<div class="box">
				${state.is_exporting
					? html`
						${compositor.canvas.getElement()}
					`
					: null}
				<div class=progress>
					<div class=stats>
						<span class=percentage>
							Progress ${state.export_status === "complete" || state.export_status === "flushing"
								? "100"
								: state.export_progress.toFixed(2)}
							%
						</span>
						<span class=status>Status: ${state.export_status}</span>
					</div>
					<div class=progress-bar>
						<div
							class="bar"
							style="
								width: ${state.export_status === "complete" || state.export_status === "flushing"
									? "100"
									: state.export_progress.toFixed(2)
							}%"
						>
						</div>
					</div>
					<div class=buttons>
						<button
							@click=${() => {
								dialog?.close()
								video_export.resetExporter(use.context.state)
							}}
							class="cancel"
							?data-complete=${state.export_status === "complete"}
						>
							${state.export_status === "complete" ? "Continue editing" : "Cancel Export"}
						</button>
						<button
							@click=${() => video_export.save_file()}
							class="sparkle-button save-button"
							.disabled=${state.export_status !== "complete"}
						>
							<span  class="spark"></span>
							<span class="backdrop"></span>
							${saveSvg}
							<span class=text>save</span>
						</button>
					</div>
				</div>
			</div>
		</dialog>
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
				@click=${() => use.context.controllers.video_export.export_start(use.context.state, use.context.state.settings.bitrate)}
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
