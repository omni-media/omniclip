import {html} from "lit"
import type {TextDetailsProps} from "../view.js"

export const renderDropShadowDetails = ({style, update}: TextDetailsProps) => {
	const value = style.dropShadow
	const enabled = !!value
	const props = (typeof value === 'object' && value) || {}

	return html`
		<details>
			<summary>Drop Shadow</summary>
			<div class="cnt">
				<label>
					<input
						type="checkbox"
						?checked=${enabled}
						@change=${(e: any) => {
							const checked = e.target.checked
							update({
								dropShadow: checked
									? {distance: 5, blur: 5, angle: 45, alpha: 0.5, color: '#000000'}
									: false
							})
						}}
					>
					Enable
				</label>

				<div data-enabled=${enabled} class=cnt>
					<label>Color</label>
					<input
						type="color"
						value=${props.color ?? '#000000'}
						@input=${(e: any) => update({dropShadow: {...props, color: e.target.value}})}
					>

					<label>Alpha</label>
					<input
						type="number" min="0" max="1" step="0.05"
						value=${props.alpha ?? 0.5}
						@input=${(e: any) => update({dropShadow: {...props, alpha: Number(e.target.value)}})}
					>

					<label>Angle</label>
					<input
						type="number" min="0" max="360" step="1"
						value=${props.angle ?? 45}
						@input=${(e: any) => update({dropShadow: {...props, angle: Number(e.target.value)}})}
					>

					<label>Blur</label>
					<input
						type="number" min="0" step="1"
						value=${props.blur ?? 5}
						@input=${(e: any) => update({dropShadow: {...props, blur: Number(e.target.value)}})}
					>

					<label>Distance</label>
					<input
						type="number" min="0" step="1"
						value=${props.distance ?? 5}
						@input=${(e: any) => update({dropShadow: {...props, distance: Number(e.target.value)}})}
					>
				</div>
			</div>
		</details>
	`
}
