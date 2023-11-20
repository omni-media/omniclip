import {At, XClip} from "../../../context/controllers/timeline/types.js"
import {calculate_track_clip_length} from "./calculate_track_clip_length.js"

export function translate_to_timecode(grabbed: XClip, hovering: At) {
	const [x, y] = hovering.coordinates
	const timeline_start = x - calculate_track_clip_length(grabbed) / 2
	const timeline_end = x - calculate_track_clip_length(grabbed) / 2 + grabbed.duration
	const track = Math.floor(y / 40)

	return {
		timeline_start,
		timeline_end,
		track
	}
}
