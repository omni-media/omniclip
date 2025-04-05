
import {setupLettuce, single_panel_layout} from "@e280/lettuce"
import {AboutPanel} from "./dom/panels/about/panel.js"
import {UnknownPanel} from "./dom/panels/unknown/panel.js"

setupLettuce({
	panels: {
		AboutPanel,
		UnknownPanel,
	},
	layouts: {
		default: single_panel_layout("AboutPanel"),
		empty: single_panel_layout("AboutPanel"),
	},
})

