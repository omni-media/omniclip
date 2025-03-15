import {generate_id} from "@benev/slate/x/tools/generate_id.js"

import {HistoricalState, NonHistoricalState} from "./types.js"

export const historical_state: HistoricalState = {
	projectName: `project-${generate_id().slice(0, 6)}`,
	projectId: generate_id(),
	tracks: [
		{
			id: generate_id(),
			visible: true,
			locked: false,
			muted: false
		}
	],
	effects: [],
	filters: [],
	animations: [],
	transitions: []
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
		aspectRatio: "16/9",
		bitrate: 9000,
		standard: "1080p"
	},
}
