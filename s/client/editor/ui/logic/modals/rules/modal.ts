
import {html} from "lit"

import {confirmModal} from "../common/confirm.js"
import {RuleEditor, type RuleDraft} from "./view.js"
import {ruleConflictMessage} from "../../utils/rule-conflict.js"
import type {EditorContext} from "../../../../context/context.js"
import {removeRule} from "../../../../context/parts/rules/ops.js"
import type {OutlinerState} from "../../../../context/parts/state.js"

function updateRules(context: EditorContext, change: (state: OutlinerState) => void) {
	let message = ""
	context.session.organization.update(change, rules => {
		message = ruleConflictMessage(rules)
	})

	return message
}

export async function deleteRule(context: EditorContext, ruleId: string) {
	const state = context.strata.outliner.state
	const rule = state.rules.find(rule => rule.id === ruleId)
	if (!rule) return

	const usageCount = state.ruleAssignments.filter(({itemId, ruleIds}) =>
		context.session.index.items.has(itemId) && ruleIds.includes(ruleId),
	).length

	const confirmed = await context.modals.openModal(confirmModal({
		title: "Delete rule?",
		content: html`<p>
			“${rule.label}” is used by ${usageCount} ${usageCount === 1 ? "structure" : "structures"}.
			Deleting it removes its restrictions from all assigned structures. Clips and tags are kept.
		</p>`,
		yes: "Delete rule",
		no: "Cancel",
		confirmVariant: "danger",
	}))
	if (confirmed) {
		context.strata.outliner.mutate(state => removeRule(state, ruleId))
	}
}

export function openRuleEditor(context: EditorContext, ruleId: string | undefined, onSave: () => void) {
	const editedRule = context.strata.outliner.state.rules.find(rule => rule.id === ruleId)

	void context.modals.openModal<void>({
		label: editedRule ? "Edit rule" : "Create rule",
		render: (_, modal) => {
			const save = (draft: RuleDraft): string | null => {
				const id = editedRule?.id ?? context.session.getId()
				const nameInUse = context.strata.outliner.state.rules.some(rule =>
					rule.id !== id && rule.label.toLowerCase() === draft.label.toLowerCase(),
				)
				if (nameInUse) return "A rule with this name already exists."

				const error = updateRules(context, state => {
					state.rules = [...state.rules.filter(rule => rule.id !== id), {id, ...draft}]
				})
				if (error) return error

				modal.resolve()
				onSave()
				return null
			}

			return RuleEditor(context, {rule: editedRule, save, cancel: modal.cancel})
		},
	})
}

