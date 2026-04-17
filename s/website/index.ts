import {html, css} from "lit"
import {dom, shadowElement, useCss, useShadow} from "@e280/sly"

import {Nav} from "./dom/nav/view.js"
import {Hero} from "./dom/hero/view.js"
import {Footer} from "./dom/footer/view.js"
import {Features} from "./dom/features/view.js"
import {Ecosystem} from "./dom/ecosystem/view.js"
import {Developers} from "./dom/developers/view.js"
import {OpenSource} from "./dom/open-source/view.js"

export const landingPage = shadowElement(() => {
	useCss(css`:host {
		background: #141110;
		width: 100%;
	}`)

	const shadow = useShadow()

   function getNavSection(id: string) {
   	try {
    	return dom(`[id="${id}"]`, shadow) as HTMLElement
   	}
   	catch(e) {}
  }

	return html`
		${Nav(getNavSection)}
		${Hero()}
    <section id="features">
			${Features()}
    </section>
    <section id="open-source">
			${OpenSource()}
    </section>
		<section id="ecosystem" class="ecosystem">
			${Ecosystem()}
		</section>
    <section class="developers" id="developers">
			${Developers()}
    </section>
		${Footer([])}
	`
})

