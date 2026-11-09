
import {need} from "@e280/stz"
import {Kind, type Id} from "@omnimedia/omnitool"

import {itemLabel} from "../../../../../../../logic/utils/item-label.js"
import {Idx, type Index} from "../../../../../../../logic/parts/index.js"
import type {Tags} from "../../../../../../../../context/parts/tags/tags.js"

export function matchingItems(rootId: Id, index: Index, tags: Tags, term: string) {
	const visible = new Set<Id>()

	const visit = (id: Id): boolean => {
		const item = index.getItem(id)
		const childrenMatch = Idx.isStruct(item)
			? item.childrenIds.map(visit).some(Boolean)
			: false
		const labels = tags.ids(id).map(id => need(tags.definitions, id).label)
		const text = [itemLabel(item), Kind[item.kind], id, ...labels].join(" ")
		const matches = !term || text.toLowerCase().includes(term)
		if (matches || childrenMatch) visible.add(id)
		return matches || childrenMatch
	}

	visit(rootId)
	return visible
}
