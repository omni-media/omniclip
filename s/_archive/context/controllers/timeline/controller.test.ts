import {Suite} from "cynic"
import {expect} from "chai"
import {setup} from "./setups/setup.js"

export default <Suite> {
	"timeline": {
		"calculate proposed effect placement": {
			"should be dropped after hovered effect if there is space": async() => {
				// const {timelineController, timelineTree} = setup()
				// const grabbed_effect = timelineTree.state.effects[0]
				// const hovered_effect = timelineTree.state.effects[3]
				// const hover_at = hovered_effect.start_at_position + 10
				// const proposed = timelineController.calculate_proposed_timecode({
				// 	timeline_start: hover_at,
				// 	timeline_end: hover_at + grabbed_effect.duration,
				// 	track: hovered_effect.track
				// }, grabbed_effect.id, timelineTree.state)
				// expect(proposed.proposed_place.start_at_position).to.equal(hovered_effect.start_at_position + hovered_effect.duration)
			},
			"should be shrinked if there is not enough space after hovered effect": async() => {
				// const {timelineController, timelineTree} = setup()
				// const grabbed_effect = timelineTree.state.effects[1]
				// const hovered_effect = timelineTree.state.effects[4]
				// const effect_after_hovered_effect = timelineTree.state.effects[5]
				// const space = effect_after_hovered_effect.start_at_position - (hovered_effect.start_at_position + hovered_effect.duration)
				// const hover_at = hovered_effect.start_at_position + 10
				// const proposed = timelineController.calculate_proposed_timecode({
				// 	timeline_start: hover_at,
				// 	timeline_end: hover_at + grabbed_effect.duration,
				// 	track: hovered_effect.track
				// }, grabbed_effect.id, timelineTree.state)
				// expect(proposed.duration).to.equal(space)
			}
		}
	}
}

