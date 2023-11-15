import {html} from "@benev/slate"

import {light_view} from "../../../../context/slate.js"

export const AddTrackIndicator = light_view(use => () => {
	const drag = use.context.controllers.timeline.drag
	const [indicator, setIndicator] = use.state(false)

	const augmented_drag = {
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
			@dragenter=${augmented_drag.enter}
			@dragleave=${augmented_drag.leave}
			@drop=${augmented_drag.drop}
			class="indicator-area"
		>
		</div>
	`
})
