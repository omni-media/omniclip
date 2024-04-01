import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../context/slate.js"
import {TextUpdater} from "../text-updater/view.js"
import rotateSvg from "../../icons/material-design-icons/rotate.svg.js"

export const TextPositioner = shadow_view(use => () => {
	use.styles(styles)
	use.watch(() => use.context.state.timeline)
	const {canvas} = use.context.controllers.compositor
	const selected_effect = use.context.state.timeline.selected_effect?.kind === "text"
		? use.context.state.timeline.selected_effect
		: null

	// scaling to screen coords/sizes
	const canvas_rect = canvas.getBoundingClientRect()
	const scaleX = canvas.width / canvas_rect.width
	const scaleY = canvas.height / canvas_rect.height

	use.mount(() => {
		const observer = new ResizeObserver(() => use.rerender())
		observer.observe(canvas)
		return () => observer.disconnect()
	})

	const box = use.defer(() => use.shadow.querySelector(".box"))

	return html`
		${selected_effect
		? html`
			<div
				class="box"
				style="
					width: ${selected_effect?.rect?.width / scaleX}px;
					height: ${selected_effect?.rect.height / scaleY}px;
					left: ${selected_effect.rect.position_on_canvas.x / scaleX}px;
					transform: rotate(${selected_effect.rect.rotation}rad);
					top: ${(selected_effect.rect.position_on_canvas.y - selected_effect.rect.height) / scaleY}px;
				"
			>
				<span class="rotate">${rotateSvg}</span>
				<div class="text-rect"></div>
			</div>
		`
		: null}
		${selected_effect 
			? TextUpdater([selected_effect, box!])
			: null
		}
	`
})
