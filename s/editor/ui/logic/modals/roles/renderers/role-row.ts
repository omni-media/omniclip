
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

	const dragstart = (event: DragEvent) => {
		const row = (event.currentTarget as HTMLElement).parentElement!
		const rect = row.getBoundingClientRect()
		event.dataTransfer?.setDragImage(row, event.clientX - rect.left, event.clientY - rect.top)
		drag.dragzone.dragstart(event)
	}

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
			@dragenter=${drag.dropzone.dragenter}
			@dragleave=${drag.dropzone.dragleave}
			@dragover=${drag.dropzone.dragover}
			@drop=${drag.dropzone.drop}
		>
			<span
				class="drag-handle"
				title="Drag to reorder"
				draggable=${drag.dragzone.draggable}
				@dragstart=${dragstart}
				@dragend=${drag.dragzone.dragend}
			>
				<wa-icon name="grip-vertical"></wa-icon>
			</span>

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

