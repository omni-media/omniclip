import {html} from "@benev/slate"

import {styles} from "./styles.js"
import addSvg from "../../icons/gravity-ui/add.svg.js"
import {shadow_component} from "../../context/slate.js"
import boldSvg from "../../icons/remix-icon/bold.svg.js"
import italicSvg from "../../icons/remix-icon/italic.svg.js"
import {Font} from "../../context/controllers/timeline/types.js"
import alignLeftSvg from "../../icons/remix-icon/align-left.svg.js"
import alignRightSvg from "../../icons/remix-icon/align-right.svg.js"
import alignCenterSvg from "../../icons/remix-icon/align-center.svg.js"
import {loadingPlaceholder} from "../../views/loading-placeholder/view.js"

export const OmniText = shadow_component(use => {
	use.styles(styles)
	use.watch(() => use.context.state.timeline)
	const actions = use.context.actions
	const text_manager = use.context.controllers.compositor.TextManager
	const selected_effect = use.context.state.timeline.selected_effect?.kind === "text"
		? use.context.state.timeline.selected_effect
		: null

	const update_compositor = () => {
		use.context.controllers.compositor.update_currently_played_effects(use.context.state.timeline)
	}

	return loadingPlaceholder(use.context.helpers.ffmpeg.is_loading.value, () => html`
		<h2>Update Text</h2>
		${selected_effect
			? html`
				<div class="text-selector">
					<label for="font-select">Font</label>
					<div class="flex-hover">
						<select @change=${(e: Event) => text_manager.set_text_font((e.target as HTMLSelectElement).value as Font, update_compositor)} name="fonts" id="font-select">
							<option value="Arial">Arial</option>
						</select>
						<input @change=${(e: Event) => text_manager.set_font_size(+(e.target as HTMLInputElement).value, update_compositor)} class="font-size" value=${selected_effect.size}>
					</div>
					<div class=flex-hover>
						<div ?data-selected=${selected_effect.style === "bold"} @click=${() => text_manager.set_font_style("bold", update_compositor)} class="bold">${boldSvg}</div>
						<div ?data-selected=${selected_effect.style === "italic"} @click=${() => text_manager.set_font_style("italic", update_compositor)} class="italic">${italicSvg}</div>
					</div>
					<div class=flex-hover>
						<div ?data-selected=${selected_effect.align === "left"} @click=${() => text_manager.set_text_align("left", update_compositor)} class="align">${alignLeftSvg}</div>
						<div ?data-selected=${selected_effect.align === "center"} @click=${() => text_manager.set_text_align("center", update_compositor)} class="align">${alignCenterSvg}</div>
						<div ?data-selected=${selected_effect.align === "right"} @click=${() => text_manager.set_text_align("right", update_compositor)} class="align">${alignRightSvg}</div>
					</div>
					<div class="color-picker flex">
						<span>${selected_effect.color}</span>
						<input
							@input=${(e: InputEvent) => text_manager.set_text_color((e.target as HTMLInputElement).value, update_compositor)}
							class="picker"
							type="color"
							id="head"
							name="head"
							value=${selected_effect.color}
							style="background: ${selected_effect.color};"
						>
					</div>
					<input
						@input=${(e: InputEvent) => text_manager.set_text_content((e.target as HTMLInputElement).value, update_compositor)}
						.value=${selected_effect.content} class="content"
					>
				</div>
			`
			: html`
				<div class="not-selected">
					<p>No text selected</p>
				</div>`}
			<h2>Add Text</h2>
			<div class="examples">
				<div class="example">
					<span style="color: #e66465; font-family: Lato;" class="text">
						example
					</span>
					<div @click=${() => actions.timeline_actions.add_text_effect(use.context.controllers.compositor)} class="add-btn">${addSvg}</div>
				</div>
			</div>
	`)
})
