import {Item} from "@omnimedia/omnitool"

import {Index} from "../../index.js"
import {compact} from "./placement.js"

export function normalize(index: Index, sequence: Item.Sequence) {
	return compact(index, sequence.childrenIds.map(id => index.getItem(id)))
}
