
import {html} from "lit"

import binSvg from "../../../../../../../../../icons/gravity-ui/bin.svg.js"
import type {Rule} from "../../../../../../../../../../context/parts/rules/types.js"
import editSvg from "../../../../../../../../../icons/gravity-ui/pencil-square.svg.js"

export function renderRule(rule: Rule, assigned: boolean, edit: () => void, remove: () => void) {
	const runAction = (event: Event, run: () => void) => {
		event.stopPropagation()
		const menu = (event.currentTarget as HTMLElement).closest("wa-dropdown")!
		menu.open = false
		run()
	}

	const handleActionKey = (event: KeyboardEvent) => {
		if (event.key === "Enter" || event.key === " ")
			event.stopPropagation()
	}

	return html`
		<wa-dropdown-item value=${rule.id} type="checkbox" ?checked=${assigned}>
			${rule.label}
			<span slot="details" class="rule-actions" @keydown=${handleActionKey}>
				<wa-button size="small" appearance="plain"
					aria-label=${`Edit rule ${rule.label}`}
					title="Edit rule"
					@click=${(event: Event) => runAction(event, edit)}>
					${editSvg}
				</wa-button>
				<wa-button class="rule-delete" size="small" appearance="plain"
					aria-label=${`Delete rule ${rule.label}`}
					title="Delete rule from all structures"
					@click=${(event: Event) => runAction(event, remove)}>
					${binSvg}
				</wa-button>
			</span>
		</wa-dropdown-item>
	`
}

