import {html} from "@benev/slate"

import {styles} from "./styles.js"
import addSvg from "../../icons/gravity-ui/add.svg.js"
import {shadow_component} from "../../context/slate.js"
import {loadingPlaceholder} from "../../views/loading-placeholder/view.js"

export const OmniText = shadow_component(use => {
	use.styles(styles)
	use.watch(() => use.context.state.timeline)
	const actions = use.context.actions

	return loadingPlaceholder(use.context.helpers.ffmpeg.is_loading.value, () => html`
		<div class="examples">
			<div class="example">
				<span style="color: #e66465; font-family: Lato;" class="text">
					example
				</span>
				<div @click=${() => actions.timeline_actions.add_text_effect()} class="add-btn">${addSvg}</div>
			</div>
		</div>
	`)
})
