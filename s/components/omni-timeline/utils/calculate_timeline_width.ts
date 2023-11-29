import {XClip} from "../../../context/controllers/timeline/types.js"

export function calculate_timeline_width (clips: XClip[], zoom: number) {
	const last_clip = [...clips].sort((a, b) => {
		if(a.start_at_position + a.duration > b.start_at_position + b.duration) {
			return -1
		} else {
			return 1
		}
	})[0]
	const length = ((last_clip.start_at_position + last_clip.duration) * Math.pow(2, zoom)) * -zoom + last_clip.duration / 5
	return length
}
