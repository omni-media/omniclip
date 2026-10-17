
import {Id, Item, TimelineFile} from "@omnimedia/omnitool"
import {Idx} from "./index.js"

export function add(state: TimelineFile, item: Item.Any | Idx.Clip) {
	state.items.push(item)
}

export function remove(state: TimelineFile, id: Id) {
	const i = state.items.findIndex(x => x.id === id)
	if (i !== -1)
		state.items.splice(i, 1)
}

export function update(
	state: TimelineFile,
	id: Id,
	patch: Partial<Item.Any | Idx.Clip>
) {
	const item = state.items.find(x => x.id === id)
	if (item)
		Object.assign(item, patch)
}

