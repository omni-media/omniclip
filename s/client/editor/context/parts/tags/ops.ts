
import type {Id} from "@omnimedia/omnitool"
import type {TagId} from "./types.js"
import type {OutlinerState} from "../state.js"

export function assignTags(state: OutlinerState, itemId: Id, tagIds: readonly TagId[]) {
	state.tagAssignments = state.tagAssignments.filter(assignment => assignment.itemId !== itemId)
	if (tagIds.length) state.tagAssignments.push({itemId, tagIds: [...tagIds]})
}

export function copyTags(state: OutlinerState, sourceId: Id, targetIds: readonly Id[]) {
	const source = state.tagAssignments.find(assignment => assignment.itemId === sourceId)
	if (!source) return
	for (const itemId of targetIds)
		state.tagAssignments.push({itemId, tagIds: [...source.tagIds]})
}

export function removeTag(state: OutlinerState, tagId: TagId) {
	state.tags = state.tags.filter(tag => tag.id !== tagId)
	state.tagAssignments = state.tagAssignments
		.map(assignment => ({...assignment, tagIds: assignment.tagIds.filter(id => id !== tagId)}))
		.filter(assignment => assignment.tagIds.length)
	for (const rule of state.rules) {
		for (const key of ["allow", "deny"] as const) {
			const ids = rule[key]?.filter(id => id !== tagId)
			if (ids?.length) rule[key] = ids
			else delete rule[key]
		}
	}
}

/** Move an assigned tag relative to another without changing membership. */
export function moveTag(ids: readonly TagId[], moving: TagId, target: TagId, after = false): TagId[] {
	if (moving === target || !ids.includes(moving) || !ids.includes(target)) return [...ids]
	const next = ids.filter(id => id !== moving)
	next.splice(next.indexOf(target) + Number(after), 0, moving)
	return next
}
