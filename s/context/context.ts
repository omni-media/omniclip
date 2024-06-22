import {AppCore, Pojo, Nexus, ZipAction, watch, signals} from "@benev/slate"
import {slate, Context, PanelSpec} from "@benev/construct/x/mini.js"

import {store} from "./controllers/store/store.js"
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

	#store = store(localStorage)

	#listen_for_state_changes_and_save_to_storage() {
		watch.track(() => this.#core.state, (state) => {
			this.#store.effects = state.effects
			this.#store.tracks = state.tracks
		})
	}

	get #state_from_storage() {
		if(this.#store.effects && this.#store.tracks) {
			return {effects: this.#store.effects, tracks: this.#store.tracks}
		} else return undefined
	}

	// state tree with history
	#core = new AppCore({
		initial_state: this.#state_from_storage ?? historical_state,
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
		this.controllers.compositor.update_canvas_objects(state)
	}

	redo(state: State) {
		this.#core.history.redo()
		this.controllers.compositor.update_canvas_objects(state)
	}

	clear_project() {
		this.actions.remove_all_effects()
		this.controllers.compositor.canvas.clear()
		this.controllers.compositor.init_guidelines()
	}

	get history() {
		return this.#core.history.annals
	}

	helpers = {
		ffmpeg: new FFmpegHelper(this.actions)
	}

	is_webcodecs_supported = signals.op<any>()

	controllers = {
		compositor: new Compositor(this.actions),
		media: new Media(this.actions),
	} as {
		timeline: Timeline,
		compositor: Compositor
		media: Media
		video_export: VideoExport
	}

	#check_if_webcodecs_supported() {
		if(!window.VideoEncoder && !window.VideoDecoder) {
			this.is_webcodecs_supported.setError("webcodecs-not-supported")
		} else {
			this.is_webcodecs_supported.setReady(true)
		}
	}
	
	//after loading state from localstorage, compositor objects must be recreated
	#recreate_project_from_localstorage_state(state: State, media: Media) {
		this.controllers.compositor.recreate(state.effects, media)
	}

	constructor(options: MiniContextOptions) {
		super(options)
		this.#check_if_webcodecs_supported()
		this.#listen_for_state_changes_and_save_to_storage()
		this.controllers = {
			...this.controllers,
			timeline: new Timeline(this.actions, this.controllers.media, this.controllers.compositor),
			video_export: new VideoExport(this.actions, this.controllers.compositor, this.controllers.media)
		}
		this.#recreate_project_from_localstorage_state(this.state, this.controllers.media)
		const loadingPageIndicatorElement = document.querySelector(".loading-page-indicator")
		const editor = document.createElement("construct-editor")
		document.body.removeChild(loadingPageIndicatorElement!)
		document.body.appendChild(editor)
	}
}

export const omnislate = slate as Nexus<OmniContext>
export const {shadow_component, shadow_view, light_view} = omnislate
