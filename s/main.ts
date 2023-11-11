import {register_to_dom} from "@benev/slate"
import {ConstructEditor, single_panel_layout} from "@benev/construct/x/mini.js"
//
import {AboutPanel} from "./panels/about/panel.js"
import {omnislate, OmniContext} from "./context/slate.js"
import {TimelinePanel} from "./components/omni-timeline/panel.js"
import {OmniTimeline} from "./components/omni-timeline/component.js"
import {OmniText} from "./components/omni-text/component.js";

omnislate.context = new OmniContext({
	panels: {
		AboutPanel,
		TimelinePanel,

	},
	layouts: {
		empty: single_panel_layout("AboutPanel"),
		default: single_panel_layout("AboutPanel"),
	},
})
register_to_dom({ConstructEditor,OmniTimeline,OmniText})

