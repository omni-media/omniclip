import {html} from "@benev/slate"

import {light_view} from "../../../../context/slate.js"

export const AddTrackIndicator = light_view(use => () => {
	const drag = use.context.controllers.timeline.effect_drag
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
		</div>
		<div
			data-indicator="add-track"
			@dragenter=${drag_events.enter}
			@dragleave=${drag_events.leave}
			@drop=${drag_events.drop}
			class="indicator-area"
		>
		</div>
	`
})
