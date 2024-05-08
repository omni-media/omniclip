import {AppCore, Pojo, Nexus, ZipAction, watch, signals} from "@benev/slate"
import {slate, Context, PanelSpec} from "@benev/construct/x/mini.js"

import {Media} from "./controllers/media/controller.js"
import {Timeline} from "./controllers/timeline/controller.js"
import {Compositor} from "./controllers/compositor/controller.js"
import {historical_state, non_historical_state} from "./state.js"
import {VideoExport} from "./controllers/video-export/controller.js"
import {HistoricalState, NonHistoricalState, State} from "./types.js"
import {historical_actions, non_historical_actions} from "./actions.js"
import {FFmpegHelper} from "./controllers/video-export/helpers/FFmpegHelper/helper.js"
import {StockLayouts} from "@benev/construct/x/context/controllers/layout/parts/utils/stock_layouts.js"

export interface MiniContextOptions {
	panels: Pojo<PanelSpec>,
	layouts: StockLayouts
}

export class OmniContext extends Context {
	#non_historical_state =  watch.stateTree<NonHistoricalState>(non_historical_state)

	#non_historical_actions = ZipAction.actualize(this.#non_historical_state, non_historical_actions)

	// state tree with history
	#core = new AppCore({
		initial_state: historical_state,
		history_limit: 64,
		actions_blueprint: ZipAction.blueprint<HistoricalState>()(historical_actions)
	})

	get state(): State {
		return {...this.#non_historical_state.state, ...this.#core.state}
	}

	get actions() {
		return {
			...this.#non_historical_actions,
			...this.#core.actions
		}
	}

	undo(state: State) {
		this.#core.history.undo()
		this.controllers.compositor.undo_or_redo(state)
	}

	redo(state: State) {
		this.#core.history.redo()
		this.controllers.compositor.undo_or_redo(state)
	}

	get history() {
		return this.#core.history.annals
	}

	helpers = {
		ffmpeg: new FFmpegHelper(this.actions)
	}

	is_webcodecs_supported = signals.op<any>()

	controllers = {
		timeline: new Timeline(this.actions),
		compositor: new Compositor(this.actions),
		media: new Media(this.actions),
	} as {
		timeline: Timeline,
		compositor: Compositor
		media: Media
		video_export: VideoExport
	}

	constructor(options: MiniContextOptions) {
		super(options)
		if(!window.VideoEncoder && !window.VideoDecoder) {
			this.is_webcodecs_supported.setError("webcodecs-not-supported")
		} else {
			this.is_webcodecs_supported.setReady(true)
		}
		this.controllers = {
			...this.controllers,
			video_export: new VideoExport(this.actions, this.controllers.compositor)
		}
	}
}
export const omnislate = slate as Nexus<OmniContext>
export const {shadow_component, shadow_view, light_view} = omnislate
