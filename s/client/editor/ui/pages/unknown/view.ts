
import {html} from "lit"
import {shadow, useCss, useName} from "@e280/sly"
import styleCss from "./style.css.js"
import themeCss from "../../../theme.css.js"

export const UnknownPage = shadow(() => {
	useName("unknown")
	useCss(themeCss, styleCss)

	return html`
		<header theme=topper></header>

		<div theme=paddy>
			<h1>unknown</h1>
		</div>
	`
})
