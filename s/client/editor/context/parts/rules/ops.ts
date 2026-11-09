
import type {Id} from "@omnimedia/omnitool"

import type {RuleId} from "./types.js"
import type {OutlinerState} from "../state.js"

export function assignRules(state: OutlinerState, itemId: Id, ruleIds: readonly RuleId[]) {
	state.ruleAssignments = state.ruleAssignments.filter(assignment => assignment.itemId !== itemId)
	if (ruleIds.length) state.ruleAssignments.push({itemId, ruleIds: [...new Set(ruleIds)]})
}

export function removeRule(state: OutlinerState, ruleId: RuleId) {
	state.rules = state.rules.filter(rule => rule.id !== ruleId)
	state.ruleAssignments = state.ruleAssignments
		.map(assignment => ({...assignment, ruleIds: assignment.ruleIds.filter(id => id !== ruleId)}))
		.filter(assignment => assignment.ruleIds.length)
}
