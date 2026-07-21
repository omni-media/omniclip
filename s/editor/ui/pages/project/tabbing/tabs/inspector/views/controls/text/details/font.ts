import {html} from "lit"

import type {TextDetailsProps} from "../view.js"

export const renderFontDetails = ({style, options, update}: TextDetailsProps) => html`
	<wa-details open summary="Font" icon-placement="start">
		<div class="cnt">
			<label>Size</label>
			<input
				type="number"
				min="1"
				max="9999"
				value=${style.fontSize}
				@input=${(e: any) => update({fontSize: Number(e.target.value)})}
			>
			<label>Family</label>
			<input
				type="text"
				value=${style.fontFamily}
				@input=${(e: any) => update({fontFamily: e.target.value})}
			>
			<label>Style</label>
			<select
				@change=${(e: any) => update({fontStyle: e.target.value})}
			>
				${options.fontStyle.map(v => html`
					<option ?selected=${style.fontStyle === v}>${v}</option>
				`)}
			</select>

			<label>Variant</label>
			<select
				@change=${(e: any) => update({fontVariant: e.target.value})}
			>
				${options.fontVariant.map(v => html`
					<option ?selected=${style?.fontVariant === v}>${v}</option>
				`)}
			</select>

			<label>Weight</label>
			<select
				@change=${(e: any) => update({fontWeight: e.target.value})}
			>
				${options.fontWeight.map(v => html`
					<option ?selected=${style?.fontWeight === v}>${v}</option>
				`)}
			</select>
		</div>
	</wa-details>
`
