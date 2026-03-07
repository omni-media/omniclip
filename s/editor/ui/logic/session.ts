
import {signal} from "@e280/strata"
import {Id} from "@omnimedia/omnitool"
import {Ms} from "@omnimedia/omnitool/x/units/ms.js"

import {Strata} from "../../context/parts/strata.js"
import {PIXELS_PER_MILLISECOND} from "../pages/project/tabbing/tabs/edit/constants.js"

export class OmniSession {
	$playhead = signal(0)
	$timeline = {
		scrollLeft: signal(0),
		width: signal(0)
	}

	$selectedItem = signal<Id | null>(null)
	$viewedItemId = signal<Id>(0)

	$zoom = signal(1)

	constructor(deps: {
		strata: Strata,
	}) {
		this.$viewedItemId.value = deps.strata.timeline.state.timeline.rootId
	}

	setPlayhead(time: Ms) {
		this.$playhead.set(time * PIXELS_PER_MILLISECOND * this.$zoom.value)
	}
}
