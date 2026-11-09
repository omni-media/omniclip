
import {need} from "@e280/stz"
import type {Id, Kind} from "@omnimedia/omnitool"

import {Tags} from "../tags/tags.js"
import {Idx} from "../../../ui/logic/parts/index.js"
import {allows, restrictionReason} from "./allows.js"
import type {Rule, RuleConflict} from "./types.js"

/** Structure rules apply to every leaf in their subtree. */
export class Rules {
	readonly definitions
	readonly assignments

	constructor(readonly tags: Tags) {
		this.definitions = new Map(tags.state.rules.map(rule => [rule.id, rule]))
		this.assignments = new Map(tags.state.ruleAssignments.map(assignment => [assignment.itemId, assignment.ruleIds]))
	}

	assigned(id: Id) {
		return (this.assignments.get(id) ?? []).map(id => need(this.definitions, id))
	}

	acceptedKinds(id: Id): Kind[] | undefined {
		const [first, ...rest] = this.#applicableRules(id).map(rule => rule.accepts).filter(kinds => !!kinds)
		return first?.filter(kind => rest.every(kinds => kinds.includes(kind)))
	}

	allowsUntaggedKind(containerId: Id, kind: Kind) {
		return this.#applicableRules(containerId).every(rule => allows(rule, kind, []))
	}

	allowsItem(containerId: Id, itemId: Id) {
		return !this.#itemConflict(itemId, this.#applicableRules(containerId))
	}

	conflict() {
		for (const ids of this.assignments.values()) {
			for (const id of ids) need(this.definitions, id)
		}
		for (const item of this.tags.index.queryItems(item => !Idx.isStruct(item))) {
			const conflict = this.#itemConflict(item.id, this.#applicableRules(item.id))
			if (conflict) return conflict
		}
	}

	valid() {return !this.conflict()}

	#applicableRules(id?: Id): Rule[] {
		if (id === undefined) return []
		return [...this.assigned(id), ...this.#applicableRules(this.tags.index.parents.get(id)?.id)]
	}

	#itemConflict(id: Id, rules: Rule[]): RuleConflict | undefined {
		const item = this.tags.index.getItem(id)
		if (Idx.isStruct(item)) {
			const nestedRules = [...rules, ...this.assigned(id)]
			for (const childId of item.childrenIds) {
				const conflict = this.#itemConflict(childId, nestedRules)
				if (conflict) return conflict
			}
		} else {
			const tagIds = this.tags.ids(id)
			for (const rule of rules) {
				const reason = restrictionReason(rule, item.kind, tagIds)
				if (reason) return {itemId: id, ruleId: rule.id, reason}
			}
		}
	}
}

