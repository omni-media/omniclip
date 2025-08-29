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

	const sections = use.deferOnce(() => use.shadow.querySelectorAll("section"))

	return html`
		${Nav([sections.value!])}
		${Hero([])}
    <section id="features">
			${Features([])}
    </section>
    <section id="open-source">
			${OpenSource([])}
    </section>
		<section id="ecosystem" class="ecosystem">
			${Ecosystem([])}
		</section>
    <section class="developers" id="developers">
			${Developers([])}
    </section>
		${Footer([])}
	`
})

