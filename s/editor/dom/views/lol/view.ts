
import {html, shadowView} from "@benev/slate"
import styleCss from "./style.css.js"
import themeCss from "../../../theme.css.js"
import {EditorContext} from "../../../context/context.js"

export const getLolView = (context: EditorContext) => shadowView(use => () => {
	use.styles(themeCss, styleCss)

	return html`lol`
})

