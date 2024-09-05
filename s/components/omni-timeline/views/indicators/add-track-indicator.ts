import {html} from "@benev/slate"

import {light_view} from "../../../../context/context.js"

export const AddTrackIndicator = light_view(use => () => {
	const drag = use.context.controllers.timeline.effectDragHandler
	const [indicator, setIndicator] = use.state(false)

	const drag_events = {
		drop(e: DragEvent) {
			if(drag.grabbed) {
				// drag.dropzone.drop(drag.hovering)(e)
				setIndicator(false)
			} else {
				setIndicator(false)
				// drag.dragzone.dragend()(e)
			}
		},
		end(e: DragEvent) {
			// drag.dragzone.dragend()(e)
			setIndicator(false)
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
			@pointerenter=${drag_events.enter}
			@pointerleave=${drag_events.leave}
			@pointerup=${drag_events.drop}
			@pointercancel=${drag_events.end}
			data-indicator="add-track"
			class="indicator-area"
		>
		</div>
	`
})
