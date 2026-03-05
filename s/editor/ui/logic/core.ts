
import {signal} from "@e280/strata"
import {Id} from "@omnimedia/omnitool"
import {ms, Ms} from "@omnimedia/omnitool/x/units/ms.js"

import {EditorContext} from "../../context/context.js"
import {PIXELS_PER_MILLISECOND} from "../pages/project/tabbing/tabs/edit/constants.js"

export class OmniCore {
	$playhead = signal(0)
	$timeline = {
		scrollLeft: signal(0),
		width: signal(0)
	}

	$selectedItem = signal<Id | null>(null)
	$viewedItemId = signal<Id>(0)

	$zoom = signal(1)

	constructor(private context: EditorContext) {
		this.$viewedItemId.value = context.strata.timeline.state.timeline.rootId
		context.controllers.player.playback.onTick.on(() => {
			this.setPlayhead(ms(context.controllers.player.currentTime))
		})
	}

	setPlayhead(time: Ms) {
		this.$playhead.set(time * PIXELS_PER_MILLISECOND * this.$zoom.value)
	}
}
