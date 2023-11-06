import {register_to_dom} from "@benev/slate"
import {ConstructEditor, single_panel_layout} from "@benev/construct/x/mini.js"

import {omnislate, OmniContext} from "./slate.js"
import {AboutPanel} from "./panels/about/panel.js"

omnislate.context = new OmniContext({
	panels: {
		AboutPanel
	},
	layouts: {
		empty: single_panel_layout("AboutPanel"),
		default: single_panel_layout("AboutPanel"),
	},
})

register_to_dom({ConstructEditor})
