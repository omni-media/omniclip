import {XClip} from "../../../context/controllers/timeline/types.js"

export function calculate_track_clip_length(clip: XClip) {
	return clip.end - clip.start
}
