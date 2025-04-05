
import {cssReset, nexus} from "@benev/slate"
import {setupLettuce, single_panel_layout} from "@e280/lettuce"

import {AboutPanel} from "./panels/about/panel.js"
import {UnknownPanel} from "./panels/unknown/panel.js"

nexus.context.theme = cssReset

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

