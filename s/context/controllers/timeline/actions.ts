import {ZipAction} from "@benev/slate/x/watch/zip/action.js"

import {XClip} from "./types.js"
import {actionize} from "../../../utils/actionize.js"

export const timeline_actions = actionize({
	remove_effect: state => ({id}: XClip) => {
		const filtered = state.timeline.clips.filter(clip => clip.id !== id)
		state.timeline.clips = filtered
	}
})

export type TimelineActions = ZipAction.Callable<typeof timeline_actions>
