import {Suite} from "cynic"
import {expect} from "chai"
import {setup} from "./setups/setup.js"

export default <Suite> {
	"timeline": {
		"track item": {
			"can drop from one track to another": async() => {
				const {timelineController, timelineTree} = setup()
				const [firstTrack, secondTrack] = timelineTree.state.timeline
				const [trackOneItem] = firstTrack.track_items
				timelineController.drag_item_start(trackOneItem, firstTrack)
				timelineController.drag_item_drop(trackOneItem, secondTrack)
				expect(timelineTree.state.timeline[1].track_items).to.deep.include(trackOneItem)
				expect(timelineTree.state.timeline[0].track_items).to.not.deep.contain(trackOneItem)
			},
			"should be next in line if dropped at another item": async() => {
				const {timelineController, timelineTree} = setup()
				const [firstTrack] = timelineTree.state.timeline
				const [firstItem, secondItem] = firstTrack.track_items
				timelineController.drag_item_start(secondItem, firstTrack)
				timelineController.drag_item_drop(firstItem, firstTrack)
				expect(firstTrack.track_items[0].id).equal(firstItem.id)
			}
		}
	}
}
	//	it("should be first in line if dropped at the leftmost edge of another item", async () => {

