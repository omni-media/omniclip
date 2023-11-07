import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {omnislate} from "../../slate.js"

export const OmniTimeline = omnislate.shadow_component({styles}, use => {
	const timeline = use.context.get_timeline_data()

	const render_tracks = () => {
		for(const track of timeline) {
			return html`
				<div>
					${track.map(item => html`${item.media.type}`)}
				</div>`
		}
	}

	return html`
		<div>
			${render_tracks()}
		</div>
	`
})
