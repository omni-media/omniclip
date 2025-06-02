
import {Salad} from "@e280/lettuce"
import {register_to_dom} from "@benev/slate"

import {Context} from "./context/context.js"
import {AboutPanel} from "./panels/about/panel.js"
import {UnknownPanel} from "./panels/unknown/panel.js"

register_to_dom(
	new Context().getElements()
)

Salad
	.panels(() => ({AboutPanel, UnknownPanel}))
	.layout(layman => ({
		empty: layman.single("AboutPanel"),
		default: layman.single("AboutPanel"),
	}))
	.setup()

