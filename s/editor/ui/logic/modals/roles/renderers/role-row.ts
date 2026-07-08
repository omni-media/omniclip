
import {html} from "lit"

import {RoleDrag} from "./types.js"
import {Role} from "../../../../../context/parts/state.js"
import addSvg from "../../../../icons/gravity-ui/add.svg.js"

export function renderRoleRow(props: {
	role: Role
	drag: RoleDrag
	onRemove: (role: Role) => void
	onAddSubrole: (role: Role) => void
	onUpdate: (id: number, patch: Partial<Role>) => void
}) {
	const {role, onUpdate, onAddSubrole, onRemove, drag} = props
	const custom = role.id > 0

	const updateName = (event: Event) =>
		onUpdate(role.id, {name: (event.target as HTMLInputElement).value})

	const addSubrole = (event: Event) => {
		event.stopPropagation()
		onAddSubrole(role)
	}

	const remove = (event: Event) => {
		event.stopPropagation()
		onRemove(role)
	}

	return html`
		<div
			class="role-row"
			style="--role-color: ${role.color}"
			data-drop-placement=${drag.placement ?? ""}
			draggable=${drag.dragzone.draggable}
			@dragstart=${drag.dragzone.dragstart}
			@dragend=${drag.dragzone.dragend}
			@dragenter=${drag.dropzone.dragenter}
			@dragleave=${drag.dropzone.dragleave}
			@dragover=${drag.dropzone.dragover}
			@drop=${drag.dropzone.drop}
		>
			<span class="color"></span>

			<input
				.value=${role.name}
				?disabled=${!custom}
				@input=${updateName}
			/>

			<button
				class="text-button"
				title="Add subrole"
				@click=${addSubrole}
			>
				${addSvg}
				<span>Subrole</span>
			</button>

			<button
				class="icon-button"
				title="Delete role"
				?disabled=${!custom}
				@click=${remove}
			>
				-
			</button>
		</div>
	`
}

