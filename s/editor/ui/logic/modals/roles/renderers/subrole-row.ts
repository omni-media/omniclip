
import {html} from "lit"

import {Role} from "../../../../../context/parts/state.js"

export function renderSubroleRow(props: {
	role: Role
	parent: Role
	onUpdate: (id: number, patch: Partial<Role>) => void
	onRemove: (role: Role) => void
}) {
	const {role, parent, onUpdate, onRemove} = props

	const updateName = (event: Event) =>
		onUpdate(role.id, {name: (event.target as HTMLInputElement).value})

	const remove = (event: Event) => {
		event.stopPropagation()
		onRemove(role)
	}

	return html`
		<div class="subrole-row" style="--role-color: ${parent.color}">
			<span></span>

			<input
				.value=${role.name}
				@input=${updateName}
			/>

			<span></span>

			<button
				class="icon-button"
				title="Delete subrole"
				@click=${remove}
			>
				-
			</button>
		</div>
	`
}

