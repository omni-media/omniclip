import {AnyEffect} from "../../../context/controllers/timeline/types.js"

export function calculate_timeline_width (effects: AnyEffect[], zoom: number) {
	const last_effect = [...effects].sort((a, b) => {
		if(a.start_at_position + a.duration > b.start_at_position + b.duration) {
			return -1
		} else {
			return 1
		}
	})[0] as AnyEffect | undefined
	//if width is already 3x the last effect position then stop zoom out
	if(last_effect) {
	 return ((last_effect.start_at_position + last_effect.duration) * Math.pow(2, zoom)) * -zoom + last_effect.duration / 5
	} else return 3000
}
