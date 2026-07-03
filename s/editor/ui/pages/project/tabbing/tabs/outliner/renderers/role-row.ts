
import {html} from "lit"

import {Role} from "../../../../../../../context/parts/state.js"

export function renderRoleRow(props: {
	role: Role
	count: number
	selected: boolean
	disabled: boolean
	subrole: boolean
	onSelect: (role: Role) => void
	onToggle: (role: Role) => void
}) {
	const {
		role,
		count,
		selected,
		disabled,
		subrole,
		onSelect,
		onToggle,
	} = props

	const select = () => onSelect(role)

	const toggle = (event: Event) => {
		event.stopPropagation()
		onToggle(role)
	}

	return html`
		<div
			class="role-row"
			style="--role-color: ${role.color}"
			?data-selected=${selected}
			?data-disabled=${disabled}
			?data-subrole=${subrole}
			@click=${select}
		>
			<button
				class="role-toggle"
				?data-enabled=${role.enabled}
				@click=${toggle}
			>
				<span></span>
			</button>

			<span class="role-name">${role.name}</span>
			<span class="role-count">${count}</span>
		</div>
	`
}

