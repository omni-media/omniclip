
import type {Id, Kind} from "@omnimedia/omnitool"

import type {TagId} from "../tags/types.js"

export type Rules = {
	accepts?: Kind[]
	allow?: TagId[]
	deny?: TagId[]
}

export type RuleId = string

export type Rule = Rules & {
	id: RuleId
	label: string
}

export type RuleAssignment = {
	itemId: Id
	ruleIds: RuleId[]
}

export type RuleConflict = {
	itemId: Id
	ruleId: RuleId
	reason: "kind" | "allow" | "deny"
}
