import {html} from "lit"
import {StrokeStyle} from "pixi.js"

import type {TextDetailsProps} from "../view.js"

export const renderStrokeDetails = ({style, update}: TextDetailsProps) => {
	const stroke = style.stroke
	const isStrokeStyle = stroke && typeof stroke === 'object' && 'width' in stroke
	const current = isStrokeStyle
		? stroke as StrokeStyle
		: {color: '#ffffff', width: 1, join: 'miter', miterLimit: 10}

	const updateStroke = (partial: Partial<StrokeStyle>) => {
		const newStroke = {
			...current,
			...partial
		} as StrokeStyle
		update({stroke: newStroke})
	}

	return html`
		<wa-details open summary="Stroke" icon-placement="start">
			<div class="cnt">
				<label>Color</label>
				<input
					type="color"
					value=${current.color ?? '#ffffff'}
					@input=${(e: any) => updateStroke({color: e.target.value})}
				>

				<label>Width</label>
				<input
					type="number"
					min="0"
					step="0.5"
					value=${current.width ?? 1}
					@input=${(e: any) => updateStroke({width: Number(e.target.value)})}
				>

				<label>Join</label>
				<select
					@change=${(e: any) => updateStroke({join: e.target.value})}
				>
					${['miter', 'round', 'bevel'].map(v => html`
						<option ?selected=${current.join === v}>${v}</option>
					`)}
				</select>

				<label>Miter Limit</label>
				<input
					type="number"
					min="0"
					step="0.1"
					value=${current.miterLimit ?? 10}
					@input=${(e: any) => updateStroke({miterLimit: Number(e.target.value)})}
				>
			</div>
		</wa-details>
	`
}
