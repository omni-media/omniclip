
import {html, shadowView} from "@benev/slate"

import {styles} from "./styles.js"
import {panel, PanelProps} from "@e280/lettuce"
import warningSvg from "../../icons/gravity-ui/warning.svg.js"

export const UnknownPanel = panel({
	label: "unknown",
	icon: warningSvg,

	view: shadowView(use => ({}: PanelProps) => {
		use.name("unknown")
		use.styles(styles)
		return html`
			<h1>unknown</h1>
		`
	}),
})

