
import {html} from "@benev/slate"
import {Salad} from "@e280/lettuce"

import {styles} from "./styles.js"
import warningSvg from "../../icons/gravity-ui/warning.svg.js"

export const UnknownPanel = Salad.pan.shadowView({
	label: "unknown",
	icon: () => warningSvg,

	render: use => () => {
		use.name("unknown")
		use.styles(styles)

		return html`
			<h1>unknown</h1>
		`
	},
})

