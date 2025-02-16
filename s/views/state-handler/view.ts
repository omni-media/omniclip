import {Op, prep_render_op} from "@benev/slate"
import {html, TemplateResult} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../context/context.js"

const loadingState = shadow_view(use => () => {
	use.styles(styles)
	return html`<div class="container"></div>`
})

const errorState = shadow_view(use => (reason: string) => {
	use.styles(styles)
	if(reason === "webcodecs-not-supported") {
		return html`
			<div class="box">
				<p>Browser not supported </p>
				<p>to use omniclip, you need to use latest version of either:</p>
				<ul>
					<li>Google Chrome</li>
					<li>Microsoft Edge</li>
					<li>Firefox</li>
					<li>Other supported browsers: <a href="https://caniuse.com/?search=webcodecs%20api" target="_blank">more</a></li>
				</ul>
			</div>
			`
	} else {
		return html`<div>FFMPEG ERROR LOADING: ${reason}</div>`
	}
})

export const StateHandler = prep_render_op({
	loading: () => loadingState([]),
	error: (reason) => errorState([reason])
}) as (op: Op.For<any>, on_ready: (value: any) => TemplateResult) => TemplateResult

