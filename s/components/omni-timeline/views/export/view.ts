import {Op, html, watch} from "@benev/slate"

import {styles} from "./styles.js"
import {AspectRatio} from "./types.js"
import {export_props} from "./constants.js"
import {shadow_view} from "../../../../context/slate.js"
import saveSvg from "../../../../icons/gravity-ui/save.svg.js"
import exportSvg from "../../../../icons/gravity-ui/export.svg.js"
import {StateHandler} from "../../../../views/state-handler/view.js"

export const Export = shadow_view(use => () => {
	use.styles(styles)
	use.watch(() => use.context.state.timeline)

	const compositor = use.context.controllers.compositor
	const video_export = use.context.controllers.video_export
	const state = use.context.state.timeline
	const [logs, setLogs, getLogs] = use.state<string[]>([])

	const [{width, height}, setSelectedResolution] = use.state({width: 1920, height: 1080})
	const [selectedAsptectRatio, setSelectedAspectRatio] = use.state<AspectRatio>("16/9")

	const render_export_props = () => {
		const props = export_props.filter(prop => prop.aspect_ratio === selectedAsptectRatio)
		return props.map(p => {
			const res = `${p.width}x${p.height}`
			return html`<p @click=${() => setSelectedResolution({width: p.width, height: p.height})} ?data-selected=${p.width === width && p.height === height}>${res} - ${p.height !== 2160 ? `${p.height}p` : "4K"}</p>`
		})
	}
	
	use.mount(() => {
		const dispose = watch.track(() => use.context.state.timeline.log, (log) => {
			if(getLogs().length === 20) {
				const new_arr = getLogs().slice(1)
				setLogs(new_arr)
			}
			setLogs([...getLogs(), log])
		})
		return () => dispose()
	})

	if(use.context.state.timeline.is_exporting) {
		const dialog = use.shadow.querySelector("dialog")
		dialog?.showModal()
	}

	return StateHandler(Op.all(
		use.context.helpers.ffmpeg.is_loading.value,
		use.context.is_webcodecs_supported.value), () => html`
		<div class="flex">
			<dialog @cancel=${(e: Event) => e.preventDefault()}>
				<div class="box">
					${state.is_exporting
						? html`
							${compositor.canvas_element}
						`
						: null}
					<div class="flex-col">
						<div class="progress">
							<span class="status">
								Progress ${state.export_status === "complete" || state.export_status === "flushing"
									? "100"
									: state.export_progress.toFixed(2)}
								%
							</span>
							<span>Status: ${state.export_status}</span>
							<span>FPS: ${state.fps}</span>
							<span class=logs-txt>logs:</span>
							<div class=logs>
								<div class="box-logs">
									${logs.map(log => html`<span>${log}<span>`)}
								</div>
							</div>
						</div>
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
			</dialog>
			${render_export_props()}
			<div class=export>
				<span class=info>${`${width}x${height}`}@${use.context.state.timeline.timebase}fps</span>
				<button class="sparkle-button" @click=${() => video_export.export_start(use.context.state.timeline, [width, height])}>
					<span class="text">${exportSvg}<span>Export</span></span>
				</button>
			</div>
		</div>
	`)
})
