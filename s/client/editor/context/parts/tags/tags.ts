
import type {Id, Item} from "@omnimedia/omnitool"

import type {Tag} from "./types.js"
import type {OutlinerState} from "../state.js"

export type OrganizationIndex = {
	items: ReadonlyMap<Id, Item.Any>
	parents: ReadonlyMap<Id, {id: Id}>
	getItem(id: Id): Item.Any
	queryItems(predicate: (item: Item.Any) => boolean): Iterable<Item.Any>
}

/** Tag membership is explicit; only colors inherit through the tree. */
export class Tags {
	readonly definitions
	readonly assignments

	constructor(readonly index: OrganizationIndex, readonly state: OutlinerState) {
		this.definitions = new Map(state.tags.map(tag => [tag.id, tag]))
		this.assignments = new Map(state.tagAssignments.map(assignment => [assignment.itemId, assignment.tagIds]))
	}

	ids(id: Id) {return this.assignments.get(id) ?? []}

	colorTag(id: Id): Tag | undefined {
		for (const tagId of this.ids(id)) {
			const tag = this.definitions.get(tagId)
			if (tag?.color) return tag
		}
	}

	color(id?: Id): string | undefined {
		if (id === undefined) return
		return this.colorTag(id)?.color ?? this.color(this.index.parents.get(id)?.id)
	}
}
