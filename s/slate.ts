import {SlateFor} from "@benev/slate"
import {slate, Context} from "@benev/construct/x/mini.js"

import {OmniState} from "./types"
import {TrackItem} from "./components/omni-timeline/types.js"

export class OmniContext extends Context {
	#tree = this.watch.stateTree<OmniState>({
		raw_media: [{type: "Text", source: ""}],
		timeline_data: [[{media: {type: "Text", source: ""}, start: 0, end: 0, priority: 0}]]
	})

	get_raw_media() {
		return this.#tree.state.raw_media
	}

	get_timeline_data() {
		return this.#tree.state.timeline_data
	}

	add_track() {
		this.#tree.state.timeline_data.push([])
	}

	add_track_item(item: TrackItem, track_index: number) {
		this.#tree.state.timeline_data[track_index].push(item)
	}
}

export const omnislate = slate as SlateFor<OmniContext>
export const {shadow_component, shadow_view} = omnislate
