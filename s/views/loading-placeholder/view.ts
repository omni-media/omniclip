import {Op, prep_render_op} from "@benev/slate"
import {html, TemplateResult} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../context/slate.js"

const loadingIndicator = shadow_view(use => () => {
	use.styles(styles)
	return html`<div class="container"></div>`
})

export const loadingPlaceholder =  prep_render_op({
	loading: () => loadingIndicator([]),
	error: (reason) => html`<div>FFMPEG ERROR LOADING: ${reason}</div>`
}) as (op: Op.For<any>, on_ready: (value: any) => TemplateResult) => TemplateResult

