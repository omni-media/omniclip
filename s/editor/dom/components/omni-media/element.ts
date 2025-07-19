
import {html, shadowComponent} from "@benev/slate"
import styleCss from "./style.css.js"
import themeCss from "../../../theme.css.js"
import {EditorContext} from "../../../context/context.js"

export const getOmniMedia = (context: EditorContext) => shadowComponent(use => {
	use.styles(themeCss, styleCss)
	const {LolView} = context.views

	return html`
		<p>omni media</p>
		${LolView([])}
	`
})

