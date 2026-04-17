
import {html} from "lit"
import {shadow, useCss, useName} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../../../theme.css.js"
import {EditorContext} from "../../../context/context.js"

export const Example = (context: EditorContext) => shadow(() => {
	useName("example")
	useCss(themeCss, styleCss)

	return html`
		<div class=example>
			example
		</div>
	`
})
