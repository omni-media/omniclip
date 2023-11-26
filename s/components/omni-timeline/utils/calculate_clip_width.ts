import {XClip} from "../../../context/controllers/timeline/types.js"

export function calculate_clip_width(clip: XClip, zoom: number) {
	return (clip.end - clip.start) * Math.pow(2, zoom) 
}
