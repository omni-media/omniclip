import {ZipAction} from "@benev/slate/x/watch/zip/action.js"
import {generate_id} from "@benev/slate/x/tools/generate_id.js"

import {XClip} from "./types.js"
import {TimelineHelpers} from "./helpers.js"
import {actionize} from "../../../utils/actionize.js"

export const timeline_actions = actionize({
	set_clip_track: state => (clip: XClip, track: number) => {
		const helper = new TimelineHelpers(state.timeline)
		helper.get_clip(clip)!.track = track
	},
	add_track: state => () => {
		state.timeline.tracks.push({id: generate_id()})
	},
})

export type TimelineActions = ZipAction.Callable<typeof timeline_actions>
