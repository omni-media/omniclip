import {generate_id} from "@benev/slate/x/tools/generate_id.js"

import {HistoricalState, NonHistoricalState} from "./types.js"

export const historical_state: HistoricalState = {
	tracks: [
		{id: generate_id()},
		{id: generate_id()},
		{id: generate_id()},
		{id: generate_id()},
	],
	effects: []
}

export const non_historical_state: NonHistoricalState = {
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
	log: "",
	settings: {
		width: 1920,
		height: 1080,
		aspect_ratio: "16/9"
	}
}
