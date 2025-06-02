
import {html, shadowComponent} from "@benev/slate"
import styleCss from "./style.css.js"
import themeCss from "../../../theme.css.js"
import {Context} from "../../../context/context.js"

export const getOmniMedia = (context: Context) => shadowComponent(use => {
	use.styles(themeCss, styleCss)
	const {LolView} = context.views

	// omg we have context
	void context.state

	return html`
		<p>omni media</p>
		${LolView([])}
	`
})

