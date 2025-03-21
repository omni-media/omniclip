import {GoldElement} from "@benev/slate"

import {AnyEffect} from "../../../context/types.js"

export function calculate_timeline_width (effects: AnyEffect[], zoom: number, timeline: GoldElement) {
	const last_effect = [...effects].sort((a, b) => {
		if(a.start_at_position + (a.end - a.start) > b.start_at_position + (b.end - b.start)) {
			return -1
		} else {
			return 1
		}
	})[0] as AnyEffect | undefined
	//if width is already 3x the last effect position then stop zoom out
	if(last_effect) {
		const result = ((last_effect.start_at_position + (last_effect.end - last_effect.start)) * Math.pow(2, zoom)) + (((last_effect.end - last_effect.start) / 5) * Math.pow(2, zoom))
		if(result < timeline.getBoundingClientRect().width) {
			return timeline.clientWidth
		} else return result
	} else return timeline.clientWidth
}
