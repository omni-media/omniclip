
import {html} from "@benev/slate"
import {Salad} from "@e280/lettuce"

import themeCss from "../../theme.css.js"
import warningSvg from "../../icons/gravity-ui/warning.svg.js"
import styleCss from "../../components/omni-media/style.css.js"

import {Context} from "../../context/context.js"

export const getUnknownPanel = (context: Context) => Salad.pan.shadowView({
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

