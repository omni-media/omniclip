
import {html} from "lit"
import {shadow, useCss} from "@e280/sly"

import styleCss from "./style.css.js"

export const Footer = shadow(() => {
	useCss(styleCss)

	return html`
		<footer>
			<span>2026 omniclip</span>
			<div class="f-links">
				<a href="https://github.com/omni-media/omniclip" target="_blank" rel="noreferrer">GitHub</a>
				<a href="https://www.npmjs.com/org/omnimedia" target="_blank" rel="noreferrer">npm</a>
				<a href="https://github.com/omni-media/omniclip/commits" target="_blank" rel="noreferrer">Changelog</a>
				<a href="https://discord.gg/Nr8t9s5wSM" target="_blank" rel="noreferrer">Discord</a>
			</div>
		</footer>
	`
})

