import {css, html, shadowComponent} from "@benev/slate"

import {Nav} from "./dom/nav/view.js"
import {Hero} from "./dom/hero/view.js"
import {Footer} from "./dom/footer/view.js"
import {Features} from "./dom/features/view.js"
import {Ecosystem} from "./dom/ecosystem/view.js"
import {Developers} from "./dom/developers/view.js"
import {OpenSource} from "./dom/open-source/view.js"

export const landingPage = shadowComponent(use => {
	use.styles(css`:host {
		background: #141110;
		width: 100%;
	}`)

	return html`
		${Nav([])}
		${Hero([])}
		${Features([])}
		${OpenSource([])}
		${Ecosystem([])}
		${Developers([])}
		${Footer([])}
	`
})

