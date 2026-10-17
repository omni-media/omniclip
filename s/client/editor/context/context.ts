import {microbounce} from "@e280/stz"

import {ms, Kind, type TimelineFile} from "@omnimedia/omnitool"

import {syncOutliner} from "./parts/outliner.js"
import {prepareViews} from "../ui/views/views.js"
import {McpController} from "./controllers/mcp.js"
import {ModalManager} from "./parts/modal/modal.js"
import type {AssistantContext} from "../../../iso/assistant/types.js"
import {Requirements, setupRequirements} from "./parts/requirements.js"

export class EditorContext {
	static async setup(projectId: string) {
		const requirements = await setupRequirements(projectId)
		return new this(requirements)
	}

	views = prepareViews(this)
	modals = new ModalManager(this)
	mcp = new McpController(this)

	#stopPlaybackTick
	#stopTimelineSync

	constructor(private requirements: Requirements) {
		this.strata.outliner.mutate(state =>
			syncOutliner(state, this.strata.timeline.state as TimelineFile)
		)

		this.#stopPlaybackTick = requirements.controllers.player.playback.onTick.on(() => {
			this.session.$playhead(ms(requirements.controllers.player.currentTime))
		})

		this.#stopTimelineSync = this.strata.timeline.lens(s => s).on(microbounce(async state => {
			this.assistant.bumpRevision()
			const timeline = state as TimelineFile
			this.strata.outliner.mutate(state => syncOutliner(state, timeline))
			await this.controllers.player.update(timeline)
			this.session.stage.refresh()
		}))

	}

	get session() { return this.requirements.session }
	get strata() { return this.requirements.strata }
	get controllers() { return this.requirements.controllers }
	get assistant() {return this.controllers.assistant}
	get project() { return this.requirements.project }
	get driver() { return this.requirements.driver }
	get tabs() {return this.requirements.tabs}
	get player() {return this.controllers.player}
	get keybindings() {return this.requirements.keybindings}

	getAssistantContext(): AssistantContext {
		const timeline = this.session.timeline.state as TimelineFile
		const hashes = new Set(timeline.items.flatMap(item => "mediaHash" in item ? [item.mediaHash] : []))
		return {
			timeline,
			projectId: this.strata.projectId,
			settings: {...this.strata.settings.state},
			timelineRevision: this.assistant.revision,
			playhead: this.session.$playhead(),
			viewedItemId: this.session.$viewedItemId(),
			selectedItemId: this.session.$selectedItem(),
			media: Array.from(hashes, mediaHash => {
				const {filename, blob, duration} = this.project.resources.require(mediaHash)
				return {mediaHash, filename, type: blob.type, duration}
			}),
			kinds: Object.fromEntries(
				Object.entries(Kind).filter((entry): entry is [string, number] => typeof entry[1] === "number")
			)
		}
	}

	dispose = () => {
		this.mcp.dispose()
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

