
import {html, shadowView} from "@benev/slate"
import themeCss from "../../theme.css"
import styleCss from "../../components/omni-media/style.css"
import {Context} from "../../context/context.js"

export const getLolView = (context: Context) => shadowView(use => () => {
	use.styles(themeCss, styleCss)

	return html`lol`
})

