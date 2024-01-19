import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"
import {convert_ms_to_hms} from "./utils/convert_ms_to_hms.js"
import {calculate_timeline_width} from "../../utils/calculate_timeline_width.js"

export const TimeRuler = shadow_view(use => () => {
	use.styles(styles)
	const zoom = use.context.state.timeline.zoom
	const timeline_width = calculate_timeline_width(use.context.state.timeline.effects, zoom)

	const generate_time_codes = () => {
		const time_codes = []
		const second = 1000
		let offset = second * Math.pow(2, zoom)
		offset += Math.pow(2, -zoom)

		for(let time_code = 0; time_code <= timeline_width; time_code+=offset) {
			time_codes.push({
				time: convert_ms_to_hms(time_code * Math.pow(2, -zoom)),
				offset: time_code
			})
		}
		return time_codes
	}

	const time_codes = generate_time_codes()

	return html`
		<div class=time-ruler>
		${time_codes.map(({time, offset}) => html`
			<div class="time" style="transform: translateX(${offset}px)">
				${time}
			</div>
		`)}
		</div>
	`
})
