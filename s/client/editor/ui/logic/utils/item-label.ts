
import {Idx} from "../parts/index.js"
import {Item, Kind} from "@omnimedia/omnitool"

export function itemLabel(item: Item.Any) {
	return (Idx.isClip(item.kind) || Idx.isStruct(item))
		? (item as {label?: string}).label ?? Kind[item.kind]
		: Kind[item.kind]
}

