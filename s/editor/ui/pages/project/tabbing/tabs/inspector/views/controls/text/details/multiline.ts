import {html} from "lit"

import type {TextDetailsProps} from "../view.js"

export const renderMultilineDetails = ({style, options, update}: TextDetailsProps) => html`
	<wa-details summary="Multiline" icon-placement="start">
		<div class="cnt">
			<label><input
				type="checkbox"
				?checked=${style.wordWrap}
				@change=${(e: any) => update({wordWrap: e.target.checked})}
			> Enable</label>

			<label><input
				type="checkbox"
				?checked=${style.breakWords}
				@change=${(e: any) => update({breakWords: e.target.checked})}
			> Break Words</label>

			<label>Align</label>
			<select
				@change=${(e: any) => update({align: e.target.value})}
			>
				${options.align.map(v => html`
					<option ?selected=${style.align === v}>${v}</option>
				`)}
			</select>

			<label>White Space</label>
			<select
				@change=${(e: any) => update({whiteSpace: e.target.value})}
			>
				${options.whiteSpace.map(v => html`
					<option ?selected=${style.whiteSpace === v}>${v}</option>
				`)}
			</select>

			<label>Wrap Width</label>
			<input
				type="number"
				value=${style.wordWrapWidth}
				@input=${(e: any) => update({wordWrapWidth: Number(e.target.value)})}
			>
		</div>
	</wa-details>
`
