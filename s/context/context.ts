import {AppCore, Pojo, Nexus, ZipAction, watch, signals} from "@benev/slate"
import {slate, Context, PanelSpec} from "@benev/construct/x/mini.js"

import {store} from "./controllers/store/store.js"
import {removeLoadingPageIndicator} from "../main.js"
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
	projectId: string
	panels: Pojo<PanelSpec>,
	layouts: StockLayouts
}

export class OmniContext extends Context {
	#non_historical_state =  watch.stateTree<NonHistoricalState>(non_historical_state)

	#non_historical_actions = ZipAction.actualize(this.#non_historical_state, non_historical_actions)

	#store = store(localStorage)

	#listen_for_state_changes() {
		watch.track(() => this.#core.state, (state) => {
			this.#save_to_storage(state)
			this.#updateAnimationTimeline(state)
		})
	}

	#save_to_storage(state: HistoricalState) {
		if(state.projectId) {
			this.#store[state.projectId] = {
				projectName: state.projectName,
				projectId: state.projectId,
				effects: state.effects,
				tracks: state.tracks
			}
		}
	}

	#updateAnimationTimeline(state: HistoricalState) {
		const timelineDuration = Math.max(...state.effects.map(effect => effect.start_at_position + (effect.end - effect.start)))
		this.controllers.compositor.managers.animationManager.updateTimelineDuration(timelineDuration)
	}

	#state_from_storage(projectId: string): HistoricalState {
		return this.#store[projectId]
	}

	// state tree with history
	#core: AppCore<HistoricalState, typeof historical_actions>

	get state(): State {
		return {...this.#non_historical_state.state, ...this.#core.state}
	}

	get actions() {
		return {
			...this.#non_historical_actions,
			...this.#core?.actions
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

	controllers: {
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
		this.#core = new AppCore({
			initial_state: this.#state_from_storage(options.projectId) ?? {...historical_state, projectId: options.projectId},
			history_limit: 64,
			actions_blueprint: ZipAction.blueprint<HistoricalState>()(historical_actions)
		})
		this.#check_if_webcodecs_supported()
		const compositor = new Compositor(this.actions)
		const media = new Media(this.actions) 
		this.controllers = {
			compositor,
			media,
			timeline: new Timeline(this.actions, media, compositor),
			video_export: new VideoExport(this.actions, compositor, media),
		}
		this.#listen_for_state_changes()
		this.#recreate_project_from_localstorage_state(this.state, this.controllers.media)
		removeLoadingPageIndicator()
	}
}

export const omnislate = slate as Nexus<OmniContext>
export const {shadow_component, shadow_view, light_view, light_component} = omnislate
