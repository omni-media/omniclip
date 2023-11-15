import {html} from "@benev/slate"

import {light_view} from "../../../../context/slate.js"
import {XTrack} from "../../../../context/controllers/timeline/types.js"

export const Track = light_view(use => (track: XTrack) => {
	const [indicator, setIndicator] = use.state(false)
	const drag = use.context.controllers.timeline.drag
	
	const augmented_drag = {
		drop(e: DragEvent) {
			if(drag.hovering) {
				drag.dropzone.drop(drag.hovering)(e)
				setIndicator(false)
			}
		},
		enter() {
			setIndicator(true)
		},
		leave() {
			setIndicator(false)
		}
	}

	return html`
		<div class=track></div>
		<div class="indicators">
			<div
				?data-indicate=${indicator
					? true
					: false
				}
				class="indicator"
			>
				<span class="plus">+</span>
			</div>
			<div
				@dragenter=${augmented_drag.enter}
				@dragleave=${augmented_drag.leave}
				@drop=${augmented_drag.drop}
				class="indicator-area"
			>
			</div>
		</div>
	`
})
