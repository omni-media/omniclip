import {html, shadowView} from "@benev/slate"

import styleCss from "./style.css.js"
import themeCss from "../../../editor/theme.css.js"

export const Footer = shadowView(use => () => {
	use.styles(themeCss, styleCss)

	return html`
		<footer>
			<div class=creator-credit>
				<span class=name>Made by Przemek Galezki & Chase Moskal</span>
				<a class="github-link">
					<span>Github</span>
					<sl-icon name="github"></sl-icon>
				</a>
			</div>
			<span class=logo>OMNICLIP</span>
		</footer>`
})
