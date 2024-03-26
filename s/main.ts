import {register_to_dom} from "@benev/slate"
import {ConstructEditor, single_panel_layout} from "@benev/construct/x/mini.js"

import {omnislate, OmniContext} from "./context/slate.js"
import {TextPanel} from "./components/omni-text/panel.js"
import {MediaPanel} from "./components/omni-media/panel.js"
import {OmniText} from "./components/omni-text/component.js"
import {OmniMedia} from "./components/omni-media/component.js"
import {TimelinePanel} from "./components/omni-timeline/panel.js"
import {OmniTimeline} from "./components/omni-timeline/component.js"
import {ExportPanel} from "./components/omni-timeline/views/export/panel.js"
import {MediaPlayerPanel} from "./components/omni-timeline/views/media-player/panel.js"

omnislate.context = new OmniContext({
	panels: {
		TimelinePanel,
		MediaPanel,
		MediaPlayerPanel,
		TextPanel,
		ExportPanel
	},
	layouts: {
		empty: single_panel_layout("TimelinePanel"),
		default: single_panel_layout("TimelinePanel"),
	},
})

register_to_dom({ConstructEditor, OmniTimeline, OmniText, OmniMedia})
