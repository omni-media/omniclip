import {html} from "lit"

import type {TextDetailsProps} from "../view.js"

export const renderLayoutDetails = ({style, options, update}: TextDetailsProps) => html`
	<details>
		<summary>Layout</summary>
		<div class="cnt">
			<label>Letter Spacing</label>
			<input
				type="number"
				value=${style.letterSpacing}
				@input=${(e: any) =>
					update({letterSpacing: Number(e.target.value)})}
			>

			<label>Line Height</label>
			<input
				type="number"
				value=${style.lineHeight}
				@input=${(e: any) =>
					update({lineHeight: Number(e.target.value)})}
			>

			<label>Leading</label>
			<input
				type="number"
				value=${style.leading}
				@input=${(e: any) => update({leading: Number(e.target.value)})}
			>

			<label>Text Baseline</label>
			<select
				@change=${(e: any) => update({textBaseline: e.target.value})}
			>
				${options.textBaseline.map(v => html`
					<option ?selected=${style.textBaseline === v}>${v}</option>
				`)}
			</select>
		</div>
	</details>
`
