import {generate_id} from "@benev/slate/x/tools/generate_id.js"

import {XTimeline} from "./types.js"
import {signals} from "@benev/slate"

export const timeline_state: XTimeline = {
	is_app_loading_state: signals.op(),
	selected_effect: null,
	is_exporting: false,
	export_progress: 0,
	is_playing: false,
	timecode: 0,
	length: 1000,
	zoom: -3,
	tracks: [
		{id: generate_id()},
		{id: generate_id()},
		{id: generate_id()},
		{id: generate_id()},
	],
	effects: []
}
