
import {ms} from "@omnimedia/omnitool/x/units/ms.js"
import type {TimelineFile} from "@omnimedia/omnitool"

import {prepareViews} from "../ui/views/views.js"
import {ModalManager} from "./parts/modal/modal.js"
import {syncOutliner} from "./parts/outliner.js"
import type {AssistantContext} from "../../iso/assistant/types.js"
import {Requirements, setupRequirements} from "./parts/requirements.js"
import type {TimelinePatch, TimelinePatchResult} from "../../iso/timeline.js"

export class EditorContext {
	static async setup(projectId: string) {
		const requirements = await setupRequirements(projectId)
		return new this(requirements)
	}

	views = prepareViews(this)
	modals = new ModalManager(this)

	#stopPlaybackTick
	#stopTimelineSync
	#timelineRevision = 0

	constructor(private requirements: Requirements) {
		this.strata.outliner.mutate(state =>
			syncOutliner(state, this.strata.timeline.state as TimelineFile)
		)

		this.#stopPlaybackTick = requirements.controllers.player.playback.onTick.on(() => {
			this.session.$playhead.value = ms(requirements.controllers.player.currentTime)
		})

		this.#stopTimelineSync = this.strata.timeline.lens(s => s).on(async state => {
			this.#timelineRevision += 1
			const timeline = state as TimelineFile
			this.strata.outliner.mutate(state => syncOutliner(state, timeline))
			await this.controllers.player.update(timeline)
			this.session.stage.refresh()
		})

	}

	get session() { return this.requirements.session }
	get strata() { return this.requirements.strata }
	get controllers() { return this.requirements.controllers }
	get omni() { return this.requirements.omni }
	get project() { return this.requirements.project }
	get driver() { return this.requirements.driver }
	get tabs() {return this.requirements.tabs}
	get player() {return this.controllers.player}
	get keybindings() {return this.requirements.keybindings}

	getAssistantContext(): AssistantContext {
		return {
			timeline: this.session.timeline.state as TimelineFile,
			timelineRevision: this.#timelineRevision,
			playhead: this.session.$playhead(),
			viewedItemId: this.session.$viewedItemId(),
			selectedItemId: this.session.$selectedItem(),
		}
	}

	patchTimeline = async(patch: TimelinePatch): Promise<TimelinePatchResult> => {
		try {
			if (patch.baseRevision !== this.#timelineRevision)
				throw new Error("The timeline changed. Read the current context and try again.")

			await this.session.commitPatch(patch)
			return {
				success: true,
				revision: this.#timelineRevision,
				summary: `Applied ${patch.operations.length} timeline operation${patch.operations.length === 1 ? "" : "s"}.`,
			}
		} catch (error) {
			return {success: false, error: error instanceof Error ? error.message : String(error)}
		}
	}

	dispose = () => {
		this.#stopPlaybackTick()
		this.#stopTimelineSync()
		this.strata.dispose()
		this.controllers.cargo.dispose()
		this.requirements.keybindings.dispose()
	}

	redo = async() => {
		await this.session.redo()
	}

	undo = async() => {
		await this.session.undo()
	}
}
