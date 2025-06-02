
import {html, shadowView} from "@benev/slate"
import themeCss from "../../../theme.css.js"
import styleCss from "../../components/omni-media/style.css.js"
import {Context} from "../../../context/context.js"

export const getLolView = (context: Context) => shadowView(use => () => {
	use.styles(themeCss, styleCss)

	return html`lol`
})

