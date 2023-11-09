import {html} from "@benev/slate"

import {styles} from "./styles.js"
import { shadow_component } from "../../context/slate.js"
import {useDragAndDrop} from "@benev/construct/x/tools/shockdrop/use_drag_and_drop.js"

export const OmniTimeline = shadow_component({styles}, use => {
	const timeline = use.context.state.timeline
	//const drag = useDragAndDrop({use, handle_drop: use.context.controllers.timeline.drag_item_drop})

	const render_tracks = () => html`
		${timeline.map((track, track_index) => html`
			<div class=track>
				${track.track_items.map((t, item_index) => html`<span class=track-item>${t.item.type}</span>`)}
			</div>
		`)}
	`

	return html`
		<div class=timeline>
			${render_tracks()}
		</div>
	`
})

