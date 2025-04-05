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
	const state = use.context.state
	const compositor = use.context.controllers.compositor

	const set_project_resolution = (width: number, height: number) => {
		actions.set_project_resolution(width, height)
		compositor.set_canvas_resolution(width, height)
	}

	const set_project_timebase = (timebase: number) => {
		actions.set_timebase(timebase)
		compositor.set_timebase(timebase)
	}

	const calculateResolution = (aspectRatio: AspectRatio, standard: Standard) => {
		const consumerResolutions = {
			"4k": {
				"16/9": { width: 3840, height: 2160 },
				"21/9": { width: 5040, height: 2160 },
				"4/3": { width: 2880, height: 2160 },
				"3/2": { width: 3240, height: 2160 },
				"1/1": { width: 2160, height: 2160 },
				"9/16": { width: 2160, height: 3840 },
			},
			"2k": {
				"16/9": { width: 2560, height: 1440 },
				"21/9": { width: 3360, height: 1440 },
				"4/3": { width: 1920, height: 1440 },
				"3/2": { width: 2160, height: 1440 },
				"1/1": { width: 1440, height: 1440 },
				"9/16": { width: 1440, height: 2560 },
			},
			"1080p": {
				"16/9": { width: 1920, height: 1080 },
				"21/9": { width: 2560, height: 1080 },
				"4/3": { width: 1440, height: 1080 },
				"3/2": { width: 1620, height: 1080 },
				"1/1": { width: 1080, height: 1080 },
				"9/16": { width: 1080, height: 1920 }, //
			},
			"720p": {
				"16/9": { width: 1280, height: 720 },
				"21/9": { width: 1680, height: 720 },
				"4/3": { width: 960, height: 720 },
				"3/2": { width: 1080, height: 720 },
				"1/1": { width: 720, height: 720 },
				"9/16": { width: 720, height: 1280 }, //
			},
			"480p": {
				"16/9": { width: 854, height: 480 },
				"21/9": { width: 1120, height: 480 },
				"4/3": { width: 640, height: 480 },
				"3/2": { width: 720, height: 480 },
				"1/1": { width: 480, height: 480 },
				"9/16": { width: 480, height: 854 },
			},
		}

		return consumerResolutions[standard][aspectRatio]
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
									actions.set_standard(standard)
									const {width, height} = calculateResolution(state.settings.aspectRatio, standard)
									set_project_resolution(width, height)
								}}
								?data-selected=${standard === state.settings.standard}
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
									actions.set_aspect_ratio(aspectRatio)
									const {width, height} = calculateResolution(aspectRatio, state.settings.standard)
									set_project_resolution(width, height)
								}}
								?data-selected=${aspectRatio === state.settings.aspectRatio}
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

	const renderBitrateSetting = () => {
		return html`
			<div>
				<h4>Bitrate (kbps)</h4>
				<div class="setting-container flex">
					<input
						@input=${(e: InputEvent) => actions.set_bitrate(+(e.currentTarget as HTMLInputElement).value)}
						class="bitrate"
						.value="${state.settings.bitrate}"
						min="1"
						type="number"
					>
					${state.settings.bitrate <= 0 ? html`<span class="error">bitrate must be higher than 0</span>` : null}
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
				${renderBitrateSetting()}
			</div>
		`)
})
