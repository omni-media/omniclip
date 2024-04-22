import {AppCore, Pojo, Nexus, ZipAction, watch} from "@benev/slate"
import {slate, Context, PanelSpec} from "@benev/construct/x/mini.js"

import {Media} from "./controllers/media/controller.js"
import {Timeline} from "./controllers/timeline/controller.js"
import {Compositor} from "./controllers/compositor/controller.js"
import {VideoExport} from "./controllers/video-export/controller.js"
import {OmniState, OmniStateHistorical, OmniStateNonHistorical} from "../types.js"
import {FFmpegHelper} from "./controllers/video-export/helpers/FFmpegHelper/helper.js"
import {StockLayouts} from "@benev/construct/x/context/controllers/layout/parts/utils/stock_layouts.js"
import {timeline_historical_state, timeline_non_historical_state} from "./controllers/timeline/state.js"
import {timeline_historical_actions, timeline_non_historical_actions} from "./controllers/timeline/actions.js"

export interface MiniContextOptions {
	panels: Pojo<PanelSpec>,
	layouts: StockLayouts
}

export class OmniContext extends Context {
	#non_historical_state =  watch.stateTree<OmniStateNonHistorical>({
		timeline: timeline_non_historical_state
	})

	#non_historical_actions = ZipAction.actualize(this.#non_historical_state, {timeline_non_historical_actions})

	// state tree with history
	#core = new AppCore({
		initial_state: {timeline: timeline_historical_state},
		history_limit: 64,
		actions_blueprint: ZipAction.blueprint<OmniStateHistorical>()({timeline_historical_actions})
	})

	get state(): OmniState {
		return {timeline: {
			...this.#non_historical_state.state.timeline, ...this.#core.state.timeline
		}}
	}

	get actions() { 
		return {timeline_actions: {
			...this.#non_historical_actions.timeline_non_historical_actions,
			...this.#core.actions.timeline_historical_actions
		}}
	}

	undo() {
		this.#core.history.undo()
	}

	redo() {
		this.#core.history.redo()
	}

	get history() {
		return this.#core.history.annals
	}

	helpers = {
		ffmpeg: new FFmpegHelper(this.actions.timeline_actions)
	}

	controllers = {
		timeline: new Timeline(this.actions.timeline_actions),
		compositor: new Compositor(this.actions.timeline_actions),
		media: new Media(this.actions.timeline_actions),
	} as {
		timeline: Timeline,
		compositor: Compositor
		media: Media
		video_export: VideoExport
	}

	constructor(options: MiniContextOptions) {
		super(options)
		this.controllers = {
			...this.controllers,
			video_export: new VideoExport(this.actions.timeline_actions, this.controllers.compositor)
		}
	}
}
export const omnislate = slate as Nexus<OmniContext>
export const {shadow_component, shadow_view, light_view} = omnislate
