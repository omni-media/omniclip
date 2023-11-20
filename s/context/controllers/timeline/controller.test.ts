import {Suite} from "cynic"
import {expect} from "chai"
import {setup} from "./setups/setup.js"

export default <Suite> {
	"timeline": {
		"calculate proposed clip placement": {
			"should be dropped after hovered clip if there is space": async() => {
				const {timelineController, timelineTree} = setup()
				const grabbed_clip = timelineTree.state.timeline.clips[0]
				const hovered_clip = timelineTree.state.timeline.clips[3]
				const hover_at = hovered_clip.start_at_position + 10
				const proposed = timelineController.calculate_proposed_clip_placement({
					timeline_start: hover_at,
					timeline_end: hover_at + grabbed_clip.duration,
					track: hovered_clip.track
				}, grabbed_clip.id, timelineTree.state.timeline)
				expect(proposed.start_position).to.equal(hovered_clip.start_at_position + hovered_clip.duration)
			},
			"should be shrinked if there is not enough space after hovered clip": async() => {
				const {timelineController, timelineTree} = setup()
				const grabbed_clip = timelineTree.state.timeline.clips[1]
				const hovered_clip = timelineTree.state.timeline.clips[4]
				const clip_after_hovered_clip = timelineTree.state.timeline.clips[5]
				const space = clip_after_hovered_clip.start_at_position - (hovered_clip.start_at_position + hovered_clip.duration)
				const hover_at = hovered_clip.start_at_position + 10
				const proposed = timelineController.calculate_proposed_clip_placement({
					timeline_start: hover_at,
					timeline_end: hover_at + grabbed_clip.duration,
					track: hovered_clip.track
				}, grabbed_clip.id, timelineTree.state.timeline)
				expect(proposed.shrinked_size).to.equal(space)
			}
		}
	}
}

