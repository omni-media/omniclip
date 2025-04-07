
import {Salad} from "@e280/lettuce"
import {cssReset, nexus} from "@benev/slate"

import {AboutPanel} from "./panels/about/panel.js"
import {UnknownPanel} from "./panels/unknown/panel.js"

nexus.context.theme = cssReset

Salad
	.panels(() => ({AboutPanel, UnknownPanel}))
	.layout(layman => ({
		empty: layman.single("AboutPanel"),
		default: layman.single("AboutPanel"),
	}))
	.setup()

