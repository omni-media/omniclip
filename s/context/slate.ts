import {Pojo, Slate, ZipAction, watch} from "@benev/slate"
import {slate, Context, PanelSpec} from "@benev/construct/x/mini.js"

import {OmniState} from "../types.js"
import {Media} from "./controllers/media/controller.js"
import {Timeline} from "./controllers/timeline/controller.js"
import {timeline_state} from "./controllers/timeline/state.js"
import {Compositor} from "./controllers/compositor/controller.js"
import {timeline_actions} from "./controllers/timeline/actions.js"
import {VideoExport} from "./controllers/video-export/controller.js"
import {FFmpegHelper} from "./controllers/video-export/helpers/FFmpegHelper/helper.js"
import {StockLayouts} from "@benev/construct/x/context/controllers/layout/parts/utils/stock_layouts.js"

export interface MiniContextOptions {
	panels: Pojo<PanelSpec>,
	layouts: StockLayouts
}

export class OmniContext extends Context {
	#state =  watch.stateTree<OmniState>({
		timeline: timeline_state
	})

	get state() {
		return this.#state.state
	}

	actions = ZipAction.actualize(this.#state, {
		timeline_actions
	})

	helpers = {
		ffmpeg: new FFmpegHelper()
	}

	controllers = {
		timeline: new Timeline(this.actions.timeline_actions),
		compositor: new Compositor(this.actions.timeline_actions),
		media: new Media(),
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
			video_export: new VideoExport(this.actions.timeline_actions, this.helpers.ffmpeg, this.controllers.compositor)
		}
	}
}
export const omnislate = slate as Slate<OmniContext>
export const {shadow_component, shadow_view, light_view} = omnislate
