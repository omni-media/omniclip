
import {Id, Item} from "@omnimedia/omnitool"

import {Idx} from "../../../index.js"

export function overlayFromRoll(
	left: Idx.Clip,
	right: Idx.Clip,
) {
	return new Map<Id, Item.Any>([
		[left.id, left as Item.Any],
		[right.id, right as Item.Any],
	])
}
