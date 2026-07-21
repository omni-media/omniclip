import {html} from "lit"

import type {TextDetailsProps} from "../view.js"

export const renderFillDetails = ({style, update}: TextDetailsProps) => html`
	<wa-details open summary="Fill" icon-placement="start">
		<div class="cnt">
			<label>Color</label>
			<input
				type="color"
				value=${style.fill}
				@input=${(e: any) => update({fill: e.target.value})}
			>
		</div>
	</wa-details>
`
