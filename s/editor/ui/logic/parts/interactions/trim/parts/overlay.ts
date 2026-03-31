
import {Id, Item} from "@omnimedia/omnitool"

import {TimelineClip} from "../../../bounds.js"

export function overlayFromTrim(
	clipId: Id,
	item: TimelineClip
) {
	return new Map<Id, Item.Any>([[clipId, item as Item.Any]])
}
