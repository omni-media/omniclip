import {html} from "@benev/slate"

import {repeat} from "lit-html/directives/repeat.js";
import {styles} from "./styles.js"
import {Clip} from "./views/clip/view.js"
import {shadow_component} from "../../context/slate.js"

export const OmniTimeline = shadow_component({styles}, use => {
	use.watch(() => use.context.state.timeline)
	const render_clips = () => repeat(use.context.state.timeline.clips, (clip) => clip.id, (clip, id) => Clip([clip, id]))

	return html`
		<div
			class="timeline"
		>
			<div
				class=timeline-relative>
				${render_clips()}
			</div>
		</div>
	`
})
