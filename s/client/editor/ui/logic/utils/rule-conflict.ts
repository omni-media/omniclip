
import {need} from "@e280/stz"
import {Kind} from "@omnimedia/omnitool"

import {itemLabel} from "./item-label.js"
import type {Rules} from "../../../context/parts/rules/rules.js"
import {itemKinds} from "../../../context/parts/rules/kinds.js"

export function ruleConflictMessage(rules: Rules) {
	const conflict = rules.conflict()
	if (!conflict) return ""
	const item = need(rules.tags.index.items, conflict.itemId)
	const label = itemLabel(item)
	const rule = need(rules.definitions, conflict.ruleId)
	const tagLabels = (ids: readonly string[]) => ids.map(id => rules.tags.definitions.get(id)?.label ?? id).join(", ")
	switch (conflict.reason) {
		case "kind": return `“${label}” is ${Kind[item.kind]}, but “${rule.label}” accepts only ${rule.accepts?.map(kind => itemKinds.find(option => option.kind === kind)?.label ?? Kind[kind]).join(", ") || "no item kinds"}.`
		case "allow": return `“${label}” needs one of these tags for “${rule.label}”: ${tagLabels(rule.allow ?? [])}. Tags on its parent do not count.`
		case "deny": return `“${label}” has a tag forbidden by “${rule.label}”: ${tagLabels((rule.deny ?? []).filter(id => rules.tags.ids(conflict.itemId).includes(id)))}.`
	}
}
