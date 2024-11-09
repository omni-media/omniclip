import {Op, html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../context/context.js"
import {StateHandler} from "../state-handler/view.js"
import {AspectRatio, Standard} from "../../context/types.js"
import {aspectRatios, standards, timebases} from "./constants.js"

export const ProjectSettings = shadow_view(use => () => {
	use.styles(styles)
	use.watch(() => use.context.state)

	const actions = use.context.actions
	const compositor = use.context.controllers.compositor
	const [selectedAsptectRatio, setSelectedAspectRatio] = use.state<AspectRatio>("16/9")
	const [selectedStandard, setStandard] = use.state<Standard>("1080p")

	const set_project_resolution = (width: number, height: number) => {
		actions.set_project_resolution(width, height)
		compositor.set_canvas_resolution(width, height)
	}

	const set_project_timebase = (timebase: number) => {
		actions.set_timebase(timebase)
		compositor.set_timebase(timebase)
	}
	
	const calculateResolution = (aspectRatio: AspectRatio, standard: Standard) => {
		const [aspectWidth, aspectHeight] = aspectRatio.split('/').map(Number)
		let width = 1920
		let height = 1080

		if (standard === "4k") {
			width = 4096
			height = Math.round(width * (aspectHeight / aspectWidth))
		} else if (standard === "480p") {
			height = 480
			width = Math.round(height * (aspectWidth / aspectHeight))
		} else if (standard === "1080p") {
			height = 1080
			width = Math.round(height * (aspectWidth / aspectHeight))
		} else if (standard === "720p") {
			height = 720
			width = Math.round(height * (aspectWidth / aspectHeight))
		} else if (standard === "2k") {
			width = 2048
			height = Math.round(width * (aspectHeight / aspectWidth))
		}

		return {width, height}
	}

	const render_resolution_settings = () => {
		return html`
			<div>
				<h4>Resolution</h4>
				<div class=resolutions>
					${standards.map(standard => {
						return html`
							<p
								@click=${() => {
									const {width, height} = calculateResolution(selectedAsptectRatio, standard)
									set_project_resolution(width, height)
									setStandard(standard)
								}}
								?data-selected=${standard === selectedStandard}
							>
								${standard}
							</p>`
					})}
				</div>
			</div>
			`
	}

	const renderTimebaseSettings = () => {
		return html`
			<div>
				<h4>Timebase (FPS)</h4>
				<div class=timebases>
					${timebases.map(timebase => html`
						<div
							@click=${() => set_project_timebase(timebase)}
							class="timebase"
							?data-selected=${use.context.state.timebase === timebase}
						>
							${timebase}
						</div>
					`)}
				</div>
			</div>
		`
	}

	const renderAspectRatios = () => {
		return html`
			<div>
				<h4>Aspect Ratio</h4>
				<div class=aspect-ratios>
					${aspectRatios.map(aspectRatio => {
						return html`
							<div
								@click=${() => {
									setSelectedAspectRatio(aspectRatio)
									const {width, height} = calculateResolution(aspectRatio, selectedStandard)
									set_project_resolution(width, height)
								}}
								?data-selected=${aspectRatio === selectedAsptectRatio}
								class=cnt
							>
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
						`
					})}
				</div>
			</div>
		`
	}

	return StateHandler(Op.all(
		use.context.is_webcodecs_supported.value,
		use.context.helpers.ffmpeg.is_loading.value), () => html`
			<div class=settings>
				<h2>Project Settings</h2>
				${renderAspectRatios()}
				${render_resolution_settings()}
				${renderTimebaseSettings()}
			</div>
		`)
})
