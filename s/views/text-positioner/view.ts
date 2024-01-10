import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../context/slate.js"

export const TextPositioner = shadow_view({styles}, use => () => {
	use.watch(() => use.context.state.timeline)
	const {canvas} = use.context.controllers.compositor
	const compositor = use.context.controllers.compositor
	const selected_effect = use.context.state.timeline.selected_effect?.kind === "text"
		? use.context.state.timeline.selected_effect
		: null

	// scaling to screen coords/sizes
	const canvas_rect = canvas.getBoundingClientRect()
	const scaleX = canvas.width / canvas_rect.width
	const scaleY = canvas.height / canvas_rect.height

	return html`
		${selected_effect
		? html`
			<div
			style="
				width: ${selected_effect?.rect?.width / scaleX}px;
				height: ${selected_effect?.rect.height / scaleY}px;
				position: absolute;
				left: ${selected_effect.rect.position_on_canvas.x / scaleX}px;
				transform: rotate(${compositor.TextManager.rotate}rad);
				top: ${(selected_effect.rect.position_on_canvas.y - selected_effect.rect.height) / scaleY}px;
			" class="text-rect">
			</div>
		`
		: null}
	`
})
