import {html} from "@benev/slate"

import {light_view} from "../../../../context/slate.js"

export const AddTrackIndicator = light_view(use => () => {
	const drag = use.context.controllers.timeline.drag
	const [indicator, setIndicator] = use.state(false)

	const drag_events = {
		drop(e: DragEvent) {
			if(drag.hovering) {
				drag.dropzone.drop(drag.hovering)(e)
				setIndicator(false)
			}
		},
		enter: () => setIndicator(true),
		leave: () => setIndicator(false)
	}

	return html`
		<div
			?data-indicate=${indicator ? true : false}
			class="indicator"
		>
			<span class="plus">+</span>
		</div>
		<div
			part="add-track-indicator"
			@dragenter=${drag_events.enter}
			@dragleave=${drag_events.leave}
			@drop=${drag_events.drop}
			class="indicator-area"
		>
		</div>
	`
})
