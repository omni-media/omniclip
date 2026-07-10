
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

	const dragstart = (event: DragEvent) => {
		const row = (event.currentTarget as HTMLElement).parentElement!
		const rect = row.getBoundingClientRect()
		event.dataTransfer?.setDragImage(row, event.clientX - rect.left, event.clientY - rect.top)
		drag.dragzone.dragstart(event)
	}

	const remove = (event: Event) => {
		event.stopPropagation()
		onRemove(role)
	}

	return html`
		<div
			class="subrole-row"
			style="--role-color: ${parent.color}"
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

