
import {html} from "lit"
import {Item, Kind} from "@omnimedia/omnitool"
import {repeat} from "lit/directives/repeat.js"
import {shadow, useCss, useRef, useSignal} from "@e280/sly"

import styleCss from "./style.css.js"
import {renderRule} from "./renderers/rule.js"
import {controlsStyles} from "../styles.css.js"
import {EditorContext} from "../../../../../../../../../context/context.js"
import {assignRules} from "../../../../../../../../../context/parts/rules/ops.js"
import {ruleConflictMessage} from "../../../../../../../../logic/utils/rule-conflict.js"
import {deleteRule, openRuleEditor} from "../../../../../../../../logic/modals/rules/modal.js"

import "@awesome.me/webawesome/dist/components/input/input.js"
import "@awesome.me/webawesome/dist/components/button/button.js"
import "@awesome.me/webawesome/dist/components/dropdown/dropdown.js"
import "@awesome.me/webawesome/dist/components/dropdown-item/dropdown-item.js"

export const StructureControls = shadow((context: EditorContext, item: Item.Sequence | Item.Stack) => {
	useCss(controlsStyles, styleCss)
	const error = useSignal("")
	const selectedId = useRef(item.id)
	if (selectedId.current !== item.id) {
		selectedId.current = item.id
		error("")
	}
	const name = item.kind === Kind.Sequence ? "Sequence" : "Stack"
	const {rules: definitions, ruleAssignments} = context.strata.outliner.state
	const assigned = ruleAssignments.find(assignment => assignment.itemId === item.id)?.ruleIds[0]
	const ruleLabel = definitions.find(rule => rule.id === assigned)?.label ?? "Assign a rule"

	const rename = (event: Event) => {
		const value = (event.currentTarget as HTMLElementTagNameMap["wa-input"]).value ?? ""
		context.session.edit(o => o.set<typeof item>(item.id, {
			label: value.trim() ? value : undefined,
		}))
	}

	const setRule = (id?: string) => {
		error("")
		context.session.organization.update(
			state => assignRules(state, item.id, id ? [id] : []),
			rules => error(ruleConflictMessage(rules)),
		)
	}

	const openEditor = (id?: string) => openRuleEditor(context, id, () => error(""))

	const selectRule = (event: CustomEvent<{item: HTMLElementTagNameMap["wa-dropdown-item"]}>) => {
		const value = event.detail.item.value
		if (value === "create") openEditor()
		else if (value === "none") setRule()
		else setRule(value)
	}

	return html`<div class="controls-group fields">
		<h4 class="heading">${name}</h4>
		<wa-input size="small" label="Name"
			placeholder=${name}
			.value=${item.label ?? ""}
			@change=${rename}>
		</wa-input>
		<div class="fields">
			<span id="rules-label" class="rule-label">Rule</span>
			<wa-dropdown class="library" placement="bottom-start"
				@wa-select=${selectRule}>
				<wa-button slot="trigger" size="small" caret aria-labelledby="rules-label">
					${ruleLabel}
				</wa-button>
				<wa-dropdown-item value="none">No rule</wa-dropdown-item>
				${repeat(definitions, rule => rule.id, rule => renderRule(
					rule, assigned === rule.id, () => openEditor(rule.id), () => deleteRule(context, rule.id),
				))}
				<wa-dropdown-item value="create">Create new rule</wa-dropdown-item>
			</wa-dropdown>
			${error() ? html`<p class="error" role="alert">${error()}</p>` : ""}
		</div>
	</div>`
})

