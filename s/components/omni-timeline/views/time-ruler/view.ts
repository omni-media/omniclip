import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"
import {calculate_timeline_width} from "../../utils/calculate_timeline_width.js"

export const TimeRuler = shadow_view({styles}, use => () => {

	function padTo2Digits(num: number) {
		return num.toString().padStart(2, '0')
	}

	function convertMsToHM(milliseconds: number) {
		let seconds = Math.floor(milliseconds / 1000)
		let minutes = Math.floor(seconds / 60)
		let hours = Math.floor(minutes / 60)

		seconds = seconds % 60
		minutes = minutes % 60
		hours = hours % 24

		return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`
	}

	const timeline_width = calculate_timeline_width(use.context.state.timeline.clips)
	
	const generate_time_codes = () => {
		const time_codes = []
		const second_width = 1000
		const offset = second_width * (1 * Math.pow(2, 0))

		for(let time_code = 0; time_code <= timeline_width; time_code+=offset) {
			time_codes.push({
				time: convertMsToHM(time_code),
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
