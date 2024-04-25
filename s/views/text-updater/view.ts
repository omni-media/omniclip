import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../context/slate.js"
import boldSvg from "../../icons/remix-icon/bold.svg.js"
import italicSvg from "../../icons/remix-icon/italic.svg.js"
import alignLeftSvg from "../../icons/remix-icon/align-left.svg.js"
import alignRightSvg from "../../icons/remix-icon/align-right.svg.js"
import alignCenterSvg from "../../icons/remix-icon/align-center.svg.js"
import {loadingPlaceholder} from "../../views/loading-placeholder/view.js"
import {Font, TextEffect} from "../../context/controllers/timeline/types.js"

export const TextUpdater = shadow_view(use => (selected_effect: TextEffect) => {
	use.styles(styles)
	use.watch(() => use.context.state.timeline)
	const effect = use.context.state.timeline.effects.find(effect => effect.id === selected_effect.id)! as TextEffect

	const text_manager = use.context.controllers.compositor.managers.textManager
	const compositor = use.context.controllers.compositor

	const [opened, setOpened] = use.state({
		text_align: false,
		font_style: false
	})

	const [[x, y], setCoords] = use.state(() => {
		const object = compositor.canvas.getActiveObject()!
		return [object.left, object.top + object.getScaledHeight()]
	})

	const canvasRect = compositor.canvas_element.getBoundingClientRect()
	const scaleX = compositor.canvas.width / canvasRect.width
	const scaleY = compositor.canvas.height / canvasRect.height

	use.once(() => {
		const active_object = compositor.canvas.getActiveObject()!
		active_object.on("moving", () => {
			setCoords([active_object.left, active_object.top + active_object.getScaledHeight()])
		})
	})

	const update_compositor = () => use.context.controllers.compositor.compose_effects(use.context.state.timeline.effects, use.context.state.timeline.timecode)

	return loadingPlaceholder(use.context.helpers.ffmpeg.is_loading.value, () => html`
		<div
			style="
				transform:
					translate(
						${x / scaleX}px,
						${y / scaleY}px
					);
			"
			class="text-selector"
		>
			<div class=flex>
				<div class="flex-hover">
					<select @change=${(e: Event) => text_manager.set_text_font(effect, (e.target as HTMLSelectElement).value as Font, update_compositor)} name="fonts" id="font-select">
						<option value="Arial">Arial</option>
					</select>
					<input @change=${(e: Event) => text_manager.set_font_size(effect, +(e.target as HTMLInputElement).value, update_compositor)} class="font-size" value=${effect.size}>
				</div>
				<div data-opened=${opened.font_style} @click=${() => setOpened({text_align: false, font_style: !opened.font_style})}  class="flex-hover expandable">
					<div ?data-selected=${effect.style === "bold"} @click=${() => text_manager.set_font_style(effect, effect.style === "bold" ? "normal" : "bold", update_compositor)} class="bold">${boldSvg}</div>
					<div ?data-selected=${effect.style === "italic"} @click=${() => text_manager.set_font_style(effect, effect.style === "italic" ? "normal" : "italic", update_compositor)} class="italic">${italicSvg}</div>
				</div>
				<div data-opened=${opened.text_align} @click=${() => setOpened({text_align: !opened.text_align, font_style: false})} class="flex-hover expandable">
					<div ?data-selected=${effect.align === "left"} @click=${() => text_manager.set_text_align(effect, "left", update_compositor)} class="align">${alignLeftSvg}</div>
					<div ?data-selected=${effect.align === "center"} @click=${() => text_manager.set_text_align(effect, "center", update_compositor)} class="align">${alignCenterSvg}</div>
					<div ?data-selected=${effect.align === "right"} @click=${() => text_manager.set_text_align(effect, "right", update_compositor)} class="align">${alignRightSvg}</div>
				</div>
				<div class="color-picker flex">
					<input
						@input=${(e: InputEvent) => text_manager.set_text_color(effect, (e.target as HTMLInputElement).value, update_compositor)}
						class="picker"
						type="color"
						id="head"
						name="head"
						value=${effect.color}
						style="background: ${effect.color};"
					>
				</div>
			</div>
			<textarea
				@input=${(e: InputEvent) => text_manager.set_text_content(effect, (e.target as HTMLInputElement).value, update_compositor)}
				class="content"
			>${effect.content.trim()}</textarea>
		</div>
	`)
})
