import {register_to_dom} from "@benev/slate"
import {ConstructEditor, single_panel_layout} from "@benev/construct/x/mini.js"

import {omnislate, OmniContext} from "./context/slate.js"
import {TimelinePanel} from "./components/omni-timeline/panel.js"
import {OmniTimeline} from "./components/omni-timeline/component.js"
import {MediaPlayerPanel} from "./components/omni-timeline/views/media-player/panel.js"

omnislate.context = new OmniContext({
	panels: {
		TimelinePanel,
		MediaPlayerPanel
	},
	layouts: {
		empty: single_panel_layout("TimelinePanel"),
		default: single_panel_layout("TimelinePanel"),
	},
})

register_to_dom({ConstructEditor, OmniTimeline})
