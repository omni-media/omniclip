
import {css} from "lit"
import {shadowElement, useCss} from "@e280/sly"

import {Hero} from "./dom/hero/view.js"

export const landingPage = shadowElement(() => {
	useCss(css`:host {
		display: block;
		min-height: 100%;
		width: 100%;
		background: #050609;
		color: #eee;
		font-family: Inter, ui-sans-serif, system-ui, sans-serif;
	}`)

	return Hero()
})

