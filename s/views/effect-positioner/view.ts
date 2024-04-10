import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../context/slate.js"
import {TextUpdater} from "../text-updater/view.js"
import rotateSvg from "../../icons/material-design-icons/rotate.svg.js"

export const EffectPositioner = shadow_view(use => () => {
	use.styles(styles)
	use.watch(() => use.context.state.timeline)
	const compositor = use.context.controllers.compositor
	const selected_effect = use.context.state.timeline.selected_effect?.kind !== "audio"
		? use.context.state.timeline.selected_effect
		: null

	// scaling to screen coords/sizes
	const canvas_rect = compositor.canvas.getBoundingClientRect()
	const scaleX = compositor.canvas.width / canvas_rect.width
	const scaleY = compositor.canvas.height / canvas_rect.height

	use.mount(() => {
		const set_handle = (e: PointerEvent) => compositor.EffectResizer.set_handle(e, null, null)
		document.addEventListener("pointermove", compositor.EffectResizer.resize_effect)
		document.addEventListener("pointerup", set_handle)
		const observer = new ResizeObserver(() => use.rerender())
		observer.observe(compositor.canvas)
		return () => [
			observer.disconnect(),
			document.removeEventListener("pointermove", compositor.EffectResizer.resize_effect),
			document.removeEventListener("pointerup", set_handle)]
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
					top: ${(selected_effect.rect.position_on_canvas.y ) / scaleY}px;
				"
			>
				<span class="rotate">${rotateSvg}</span>
				<div @pointerdown=${(e: MouseEvent) => compositor.EffectResizer.set_handle(e, "left", selected_effect)} class="width left handle"></div>
				<div @pointerdown=${(e: MouseEvent) => compositor.EffectResizer.set_handle(e, "right", selected_effect)} class="width right handle"></div>
				<div @pointerdown=${(e: MouseEvent) => compositor.EffectResizer.set_handle(e, "top", selected_effect)} class="height top handle"></div>
				<div @pointerdown=${(e: MouseEvent) => compositor.EffectResizer.set_handle(e, "bottom", selected_effect)} class="height bottom handle"></div>
				<div class="rect"></div>
			</div>
		`
		: null}
		${selected_effect?.kind === "text"
			? TextUpdater([selected_effect, box!])
			: null
		}
	`
})
