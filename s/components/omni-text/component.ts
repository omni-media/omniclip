import {html} from "@benev/slate"

import {styles} from "./styles.js"
import addSvg from "../../icons/gravity-ui/add.svg.js"
import {shadow_component} from "../../context/slate.js"
import {loadingPlaceholder} from "../../views/loading-placeholder/view.js"

export const OmniText = shadow_component(use => {
	use.styles(styles)
	use.watch(() => use.context.state.timeline)
	const manager = use.context.controllers.compositor.managers.textManager

	return loadingPlaceholder(use.context.helpers.ffmpeg.is_loading.value, () => html`
		<div class="examples">
			<div class="example">
				<span style="color: #e66465; font-family: Lato;" class="text">
					example
				</span>
				<div @click=${() => manager.create_and_add_text_effect(use.context.state.timeline)} class="add-btn">${addSvg}</div>
			</div>
		</div>
	`)
})
