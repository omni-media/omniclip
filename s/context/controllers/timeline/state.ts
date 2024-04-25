import {generate_id} from "@benev/slate/x/tools/generate_id.js"

import {TimelineHistorical, TimelineNonHistorical} from "./types.js"

export const timeline_historical_state: TimelineHistorical = {
	tracks: [
		{id: generate_id()},
		{id: generate_id()},
		{id: generate_id()},
		{id: generate_id()},
	],
	effects: []
}

export const timeline_non_historical_state: TimelineNonHistorical = {
	selected_effect: null,
	is_exporting: false,
	export_progress: 0,
	export_status: "demuxing",
	fps: 0,
	timebase: 25,
	is_playing: false,
	timecode: 0,
	length: 1000,
	zoom: -3,
	log: ""
}
