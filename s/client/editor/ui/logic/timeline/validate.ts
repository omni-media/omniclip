
import {Kind, type Id, type Item, type TimelineFile} from "@omnimedia/omnitool"

const isId = (value: unknown): value is Id =>
	typeof value === "string" && /^[0-9a-f]{32}$/.test(value)

const ids = (...values: (Id | Id[] | undefined)[]) =>
	values.flatMap(value => Array.isArray(value) ? value : value === undefined ? [] : [value])

const references = (item: Item.Any) => ids(
	"childrenIds" in item ? item.childrenIds : undefined,
	"animationIds" in item ? item.animationIds : undefined,
	"filterIds" in item ? item.filterIds : undefined,
	"spatialId" in item ? item.spatialId : undefined,
	"styleId" in item ? item.styleId : undefined,
	"itemId" in item ? item.itemId : undefined,
)

export function validateTimeline(timeline: TimelineFile) {
	const items = new Map<Id, TimelineFile["items"][number]>()
	for (const item of timeline.items) {
		if (!isId(item.id) || items.has(item.id))
			throw new Error(`Invalid or duplicate item ID: ${item.id}`)
		items.set(item.id, item)
	}

	const root = items.get(timeline.rootId)
	if (!root)
		throw new Error(`Root item does not exist: ${timeline.rootId}`)
	if (root.kind !== Kind.Sequence && root.kind !== Kind.Stack)
		throw new Error("The timeline root must be a Sequence or Stack")

	for (const item of timeline.items)
		for (const id of references(item))
			if (!isId(id) || !items.has(id))
				throw new Error(`Item ${item.id} references missing item: ${id}`)

	const visiting = new Set<Id>()
	const visited = new Set<Id>()
	const visit = (id: Id) => {
		if (visiting.has(id))
			throw new Error(`Container cycle detected at item: ${id}`)
		if (visited.has(id))
			return

		visiting.add(id)
		const item = items.get(id)!
		if ("childrenIds" in item)
			for (const childId of item.childrenIds)
				visit(childId)
		visiting.delete(id)
		visited.add(id)
	}
	for (const id of items.keys())
		visit(id)
}

