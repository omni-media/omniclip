import {css, html, shadowComponent} from "@benev/slate"

import {Nav} from "./dom/nav/view.js"
import {Hero} from "./dom/hero/view.js"

export const landingPage = shadowComponent(use => {
	use.styles(css`:host {
		width: 100%;
	}`)

	return html`
		${Nav([])}
		${Hero([])}
	`
})

