
import {html} from "lit"

import {confirmModal} from "../common/confirm.js"
import {removeTag} from "../../../../context/parts/tags/ops.js"
import {ruleConflictMessage} from "../../utils/rule-conflict.js"
import type {Tag} from "../../../../context/parts/tags/types.js"
import type {EditorContext} from "../../../../context/context.js"

export async function deleteTag(context: EditorContext, tag: Tag, setError: (message: string) => void) {
	const state = context.strata.outliner.state
	const itemCount = state.tagAssignments.filter(assignment =>
		assignment.tagIds.includes(tag.id)
	).length
	const ruleCount = state.rules.filter(rule =>
		rule.allow?.includes(tag.id) || rule.deny?.includes(tag.id)
	).length

	const confirmed = await context.modals.openModal(confirmModal({
		title: `Delete '${tag.label}' tag?`,
		content: html`<p>
			Removes this tag from ${itemCount} ${itemCount === 1 ? "item" : "items"}.<br>
			Removes references to this tag from ${ruleCount} ${ruleCount === 1 ? "rule" : "rules"}.
		</p>`,
		yes: "Delete tag",
		no: "Cancel",
		confirmVariant: "danger",
	}))
	if (!confirmed) return

	setError("")
	context.session.organization.update(
		state => removeTag(state, tag.id),
		rules => setError(ruleConflictMessage(rules)),
	)
}

