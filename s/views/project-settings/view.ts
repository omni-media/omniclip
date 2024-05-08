import {Op, html} from "@benev/slate"

import {styles} from "./styles.js"
import {export_props} from "./constants.js"
import {shadow_view} from "../../context/context.js"
import {StateHandler} from "../state-handler/view.js"
import {AspectRatio} from "../../context/controllers/timeline/types.js"

export const ProjectSettings = shadow_view(use => () => {
	use.styles(styles)
	use.watch(() => use.context.state.timeline)

	const actions = use.context.actions.timeline_actions
	const compositor = use.context.controllers.compositor
	const timeline_state = use.context.state.timeline
	const [selectedAsptectRatio, setSelectedAspectRatio] = use.state<AspectRatio>("16/9")

	const set_project_resolution = (width: number, height: number) => {
		actions.set_project_resolution(width, height)
		compositor.set_canvas_resolution(width, height)
	}

	const render_resolution_settings = () => {
		const props = export_props.filter(prop => prop.aspect_ratio === selectedAsptectRatio)
		return html`
			<div>
				<h4>Resolution</h4>
				${props.map(p => {
					const res = `${p.width}x${p.height}`
					return html`<p @click=${() => set_project_resolution(p.width, p.height)} ?data-selected=${p.width === timeline_state.settings.width && p.height === timeline_state.settings.height}>${res} - ${p.height !== 2160 ? `${p.height}p` : "4K"}</p>`
				})}
			</div>
			`
	}

	return StateHandler(Op.all(
		use.context.is_webcodecs_supported.value,
		use.context.helpers.ffmpeg.is_loading.value), () => html`
			<h2>Project Settings</h2>
			${render_resolution_settings()}
		`)
})
