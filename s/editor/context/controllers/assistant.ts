
import type {OmniSession} from "../../ui/logic/session.js"
import type {TimelinePatch, TimelinePatchResult} from "../../../iso/timeline.js"

type AssistantEdit = {
	id: string
	patches: number
	revision: number
	complete: boolean
}

export class AssistantController {
	#edit: AssistantEdit | undefined
	#revision = 0

	constructor(private session: OmniSession) {}

	get revision() {
		return this.#revision
	}

	bumpRevision() {
		this.#revision += 1
	}

	patchTimeline = async(patch: TimelinePatch): Promise<TimelinePatchResult> => {
		try {
			if (patch.baseRevision !== this.revision)
				throw new Error("The timeline changed. Read the current context and try again.")

			await this.session.commitPatch(patch)

			if (!this.#edit || this.#edit.complete)
				this.#edit = {
					id: crypto.randomUUID(),
					patches: 0,
					revision: this.revision,
					complete: false,
				}
			const edit = this.#edit
			edit.patches += 1
			edit.revision = this.revision

			return {
				success: true,
				revision: this.revision,
				assistantEditId: edit.id,
				summary: `Applied ${patch.operations.length} timeline operation${patch.operations.length === 1 ? "" : "s"}.`,
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : String(error),
			}
		}
	}

	finish(id: string) {
		if (this.#edit?.id === id)
			this.#edit.complete = true
	}

	canUndo(id: string) {
		return (
			this.#edit?.id === id &&
			this.#edit.complete &&
			this.#edit.revision === this.revision
		)
	}

	async undo(id: string) {
		if (!this.canUndo(id))
			return false

		const {patches} = this.#edit!
		this.#edit = undefined

		for (let index = 0; index < patches; index += 1)
			await this.session.undo()

		return true
	}
}

