
import {Id, Item} from "@omnimedia/omnitool"

import {Idx} from "../../../index.js"

export function overlayFromTrim(
	clipId: Id,
	item: Idx.Clip
) {
	return new Map<Id, Item.Any>([[clipId, item as Item.Any]])
}
