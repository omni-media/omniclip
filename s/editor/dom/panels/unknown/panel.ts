
import {html} from "@benev/slate"
import {Salad} from "@e280/lettuce"

import styleCss from "./style.css.js"
import themeCss from "../../../theme.css.js"
import warningSvg from "../../icons/gravity-ui/warning.svg.js"

import {EditorContext} from "../../../context/context.js"

export const getUnknownPanel = (context: EditorContext) => Salad.pan.shadowView({
	label: "unknown",
	icon: () => warningSvg,

	render: use => () => {
		use.name("unknown")
		use.styles(themeCss, styleCss)

		return html`
			<h1>unknown</h1>
		`
	},
})

