import {single_panel_layout} from "@benev/construct"
import {OmniContext} from "../../slate.js"
import {Suite} from "cynic"
import {expect} from "chai"

const context = new OmniContext({
	panels: {},
	layouts: {
		default: single_panel_layout("AboutPanel"),
		empty: single_panel_layout("AboutPanel"),
	}
})
const controller = context.controllers.timeline
export default <Suite> {
	"timeline": {
		"track item": {
			"can drop from one track to another": async() => {
				const [firstTrack, secondTrack] = context.state.timeline
				const trackOneItem = firstTrack.track_items[0]
				controller.drag_item_start(trackOneItem, firstTrack)
				controller.drag_item_drop(trackOneItem, secondTrack)
				expect(secondTrack).contain(trackOneItem)
				expect(firstTrack).not.contain(trackOneItem)
			},
			"should be next in line if dropped at another item": async() => {
				const [firstTrack] = context.state.timeline
				const [firstItem, secondItem] = firstTrack.track_items
				controller.drag_item_start(secondItem, firstTrack)
				controller.drag_item_drop(firstItem, firstTrack)
				expect(firstTrack.track_items[0]).equal(firstItem)
			}
		}
	}
}
	//	it("should be first in line if dropped at the leftmost edge of another item", async () => {

