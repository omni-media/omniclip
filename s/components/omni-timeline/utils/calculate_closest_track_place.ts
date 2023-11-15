import {V2} from "./coordinates_in_rect.js"
import {XClip} from "../../../context/controllers/timeline/types.js"
import {calculate_track_clip_length} from "./calculate_track_clip_length.js"

export function calculate_closest_track_place(
	clip: XClip,
	cords: V2,
	track_height: number
): V2 {

	const [x, y] = cords

	const track_index = Math.floor(y / 40)
	const track_start = track_index * track_height

	const width = calculate_track_clip_length(clip)
	const position = {
		y: track_start,
		x: x - width / 2
	}
	return [position.x, position.y]
}

	//const track_end = (track_index + 1) * track_height
	//const margin = 5
	//const start_at = y >= track_start + margin
	//const end_at = y <= track_end - margin

