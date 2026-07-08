
import {State} from "../../../../../context/parts/state.js"
export {RoleSection} from "../../../parts/roles/constants.js"

export type RolesResult = State['outliner']['roles']

export type RoleDrag = {
	placement: "before" | "after" | null
	dragzone: {
		draggable: string
		dragstart: (event: DragEvent) => void
		dragend: (event: DragEvent) => void
	}
	dropzone: {
		dragenter: (event: DragEvent) => void
		dragleave: (event: DragEvent) => void
		dragover: (event: DragEvent) => void
		drop: (event: DragEvent) => void
	}
}

