import {generate_id} from "@benev/slate/x/tools/generate_id.js"

import {Timeline} from "./types.js"

export const timeline_state: Timeline = {
	length: 1000,
	tracks: [
		{id: generate_id()},
		{id: generate_id()},
		{id: generate_id()},
		{id: generate_id()},
	],
	clips: [
		{id: generate_id(), item: {type: "Audio", source: ""},
			start: 10, end: 70, track: 0, start_at_position: 50, length: 60
		},
		{id: generate_id(),item: {type: "Audio", source: ""}, 
			start: 70, end: 150, track: 0, start_at_position: 120, length: 80
		},
		{id: generate_id(),item: {type: "Text", content: "", color: "", size: 4},
			start: 70, end: 120, track: 1, start_at_position: 0, length: 50
		},
		{id: generate_id(),item: {type: "Video", source: ""},
			start: 0, end: 60, track: 1, start_at_position: 50, length: 60
		},
		{id: generate_id(),item: {type: "Image", source: ""},
			start: 200, end: 300, track: 2, start_at_position: 200, length: 100
		},
		{id: generate_id(),item: {type: "Video", source: ""},
			start: 400, end: 450, track: 2, start_at_position: 350, length: 50
		}
	]
}
