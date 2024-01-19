import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_component} from "../../context/slate.js"
import boldSvg from "../../icons/remix-icon/bold.svg.js"
import italicSvg from "../../icons/remix-icon/italic.svg.js"
import alignLeftSvg from "../../icons/remix-icon/align-left.svg.js"
import alignRightSvg from "../../icons/remix-icon/align-right.svg.js"
import alignCenterSvg from "../../icons/remix-icon/align-center.svg.js"
import {Font, FontStyle, TextAlign, TextEffectProps} from "../../context/controllers/timeline/types.js"

export const OmniText = shadow_component(use => {
	use.styles(styles)
	use.watch(() => use.context.state.timeline)
	const actions = use.context.actions
	const {canvas, ctx} = use.context.controllers.compositor
	const selected_effect = use.context.state.timeline.selected_effect?.kind === "text"
		? use.context.state.timeline.selected_effect
		: null

	const [
		text,
		setTextEffectProps
	] = use.state<TextEffectProps>({
		size: selected_effect?.size ?? 38,
		content: selected_effect?.content ?? "example",
		style: selected_effect?.style ?? "normal",
		font: selected_effect?.font ?? "Lato",
		color: selected_effect?.color ?? "#e66465",
		align: selected_effect?.align ?? "center",
		rect: {
			position_on_canvas: {
				x: canvas.width/2,
				y: canvas.height/2,
			},
			width: measure_text_width(),
			height: measure_text_height(),
			rotation: 0
		}
	})

	function measure_text_width () {
		ctx!.font = `${selected_effect?.size ?? 38}px ${selected_effect?.font ?? "Lato"}`;
		ctx!.fillStyle = selected_effect?.color ?? "blue";
		return ctx?.measureText(selected_effect?.content ?? "example").width!
	}

	function measure_text_height() {
		return ctx?.measureText(selected_effect?.content ?? "example").actualBoundingBoxAscent! + ctx?.measureText(selected_effect?.content ?? "example").actualBoundingBoxDescent!
	}

	const set_font = (e: Event) => setTextEffectProps({...text, font: (e.target! as HTMLSelectElement).value as Font})
	const set_font_size = (e: InputEvent) => setTextEffectProps({...text, size: +(e.target as HTMLInputElement).value})
	const set_font_style = (style: FontStyle) => setTextEffectProps({...text, style: text.style === style ? "normal" : style})
	const set_text_align = (align: TextAlign) => setTextEffectProps({...text, align})

	return html`
		<div class="text-selector">
			<label for="font-select">Font</label>
			<div class="flex-hover">
				<select @change=${set_font} name="fonts" id="font-select">
					<option value="Arial">Arial</option>
				</select>
				<input @change=${set_font_size} class="font-size" value=${text.size} />
			</div>
			<div class=flex-hover>
				<div ?data-selected=${text.style === "bold"} @click=${() => set_font_style("bold")} class="bold">${boldSvg}</div>
				<div ?data-selected=${text.style === "italic"} @click=${() => set_font_style("italic")} class="italic">${italicSvg}</div>
			</div>
			<div class=flex-hover>
				<div ?data-selected=${text.align === "left"} @click=${() => set_text_align("left")} class="align">${alignLeftSvg}</div>
				<div ?data-selected=${text.align === "center"} @click=${() => set_text_align("center")} class="align">${alignCenterSvg}</div>
				<div ?data-selected=${text.align === "right"} @click=${() => set_text_align("right")} class="align">${alignRightSvg}</div>
			</div>
			<div class="color-picker flex">
				<span>${text.color}</span>
				<input
					@input=${(e: InputEvent) => setTextEffectProps({...text, color: (e.target as HTMLInputElement).value})}
					class="picker"
					type="color"
					id="head"
					name="head"
					value=${text.color} 
					style="background: ${text.color};"
				>
			</div>
			${selected_effect
			? html`
				<button class="add-text" @click=${() => {
					actions.timeline_actions.update_text_effect(text, selected_effect.id)
					use.context.controllers.compositor.update_currently_played_effects(use.context.state.timeline)
					use.context.controllers.compositor.draw_effects(true)
				}}>
					Update text
				</button>`
			: html`<button class="add-text" @click=${() => actions.timeline_actions.add_text_effect(text)}>Add text</button>`}
		</div>
	`
})
