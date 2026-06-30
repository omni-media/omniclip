
import {ms} from "@omnimedia/omnitool/x/units/ms.js"
import type {TimelineFile} from "@omnimedia/omnitool"

import {prepareViews} from "../ui/views/views.js"
import {ModalManager} from "./parts/modal/modal.js"
import {syncOutliner} from "./parts/outliner.js"
import {Requirements, setupRequirements} from "./parts/requirements.js"

export class EditorContext {
	static async setup(projectId: string) {
		const requirements = await setupRequirements(projectId)
		return new this(requirements)
	}

	views = prepareViews(this)
	modals = new ModalManager(this)

	#stopPlaybackTick
	#stopTimelineSync

	constructor(private requirements: Requirements) {
		this.strata.outliner.mutate(state =>
			syncOutliner(state, this.strata.timeline.state as TimelineFile)
		)

		this.#stopPlaybackTick = requirements.controllers.player.playback.onTick.on(() =>
			this.session.setPlayhead(ms(requirements.controllers.player.currentTime))
		)

		this.#stopTimelineSync = this.strata.timeline.lens(s => s).on(async state => {
			const timeline = state as TimelineFile
			await this.controllers.player.update(timeline)
			this.session.stage.refresh()
			this.strata.outliner.mutate(state => syncOutliner(state, timeline))
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
