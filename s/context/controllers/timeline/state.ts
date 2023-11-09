import {generate_id} from "@benev/slate"

import {TimelineState} from "../../../types.js"

export const timeline_state: TimelineState = [
	{
		id: generate_id(),
		track_items: [
			{id: generate_id(), item: {type: "Audio", source: ""}, start: 0, end: 0, priority: 0},
			{id: generate_id(),item: {type: "Audio", source: ""}, start: 0, end: 0, priority: 0}
		]
	},
	{
		id: generate_id(),
		track_items: [
			{id: generate_id(),item: {type: "Text", content: "", color: "", size: 4}, start: 0, end: 0, priority: 0},
			{id: generate_id(),item: {type: "Video", source: ""}, start: 0, end: 0, priority: 0}
		]
	},
	{
		id: generate_id(),
		track_items: [
			{id: generate_id(),item: {type: "Image", source: ""}, start: 0, end: 0, priority: 0},
			{id: generate_id(),item: {type: "Video", source: ""}, start: 0, end: 0, priority: 0}
		]
	}
]
