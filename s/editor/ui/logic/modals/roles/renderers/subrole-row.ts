
import {html} from "lit"

import {RoleDrag} from "./types.js"
import {Role} from "../../../../../context/parts/state.js"

export function renderSubroleRow(props: {
	role: Role
	parent: Role
	drag: RoleDrag
	onRemove: (role: Role) => void
	onUpdate: (id: number, patch: Partial<Role>) => void
}) {
	const {role, parent, onUpdate, onRemove, drag} = props

	const updateName = (event: Event) =>
		onUpdate(role.id, {name: (event.target as HTMLInputElement).value})

	const remove = (event: Event) => {
		event.stopPropagation()
		onRemove(role)
	}

	return html`
		<div
			class="subrole-row"
			style="--role-color: ${parent.color}"
			data-drop-placement=${drag.placement ?? ""}
			draggable=${drag.dragzone.draggable}
			@dragstart=${drag.dragzone.dragstart}
			@dragend=${drag.dragzone.dragend}
			@dragenter=${drag.dropzone.dragenter}
			@dragleave=${drag.dropzone.dragleave}
			@dragover=${drag.dropzone.dragover}
			@drop=${drag.dropzone.drop}
		>
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

