
import {Salad} from "@e280/lettuce"
import {register} from "@benev/slate"

import {Context} from "./context/context.js"
import {getAboutPanel} from "./dom/panels/about/panel.js"
import {getUnknownPanel} from "./dom/panels/unknown/panel.js"

const context = new Context()

// register omniclip components to the dom
register(context.elements)

// setup lettuce layout system
Salad
	.panels(() => ({
		AboutPanel: getAboutPanel(context),
		UnknownPanel: getUnknownPanel(context),
	}))
	.layout(layman => ({
		empty: layman.single("AboutPanel"),
		default: layman.single("AboutPanel"),
	}))
	.setup()

