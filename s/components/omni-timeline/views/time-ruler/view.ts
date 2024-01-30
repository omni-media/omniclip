import {GoldElement, html, watch} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"
import {pad_to_2_digits} from "./utils/pad_to_2_digits.js"

export const TimeRuler = shadow_view({styles}, use => (timeline: GoldElement) => {
	const zoom = use.context.state.timeline.zoom
	const [timeCodes, setTimeCodes] = use.state<{time: string, offset: number}[]>([])

	use.setup(() => {
		const set_time_codes = () => setTimeCodes(generate_time_codes(zoom))
		watch.track(() => use.context.state.timeline.zoom, (zoom) => setTimeCodes(generate_time_codes(zoom)))
		timeline.addEventListener("scroll", set_time_codes)
		return () => timeline.removeEventListener("scroll",set_time_codes)
	})

	function convert_ms_to_hms(milliseconds: number) {
		let seconds = Math.floor(milliseconds / 1000)
		let minutes = Math.floor(seconds / 60)
		let hours = Math.floor(minutes / 60)

		seconds = seconds % 60
		minutes = minutes % 60
		hours = hours % 24

		return `${pad_to_2_digits(hours)}:${pad_to_2_digits(minutes)}:${pad_to_2_digits(seconds)}`
	}

	function generate_time_codes(zoom: number) {
		const time_codes = []
		const second = 100
		let offset = second
		offset += Math.pow(2, -zoom)

		for(let time_code = timeline.scrollLeft; time_code <= timeline.scrollLeft + timeline.clientWidth; time_code+=offset) {
			time_codes.push({
				time: convert_ms_to_hms(time_code * Math.pow(2, -zoom)),
				offset: time_code
			})
		}
		return time_codes
	}

	return html`
		<div class=time-ruler>
		${timeCodes.map(({time, offset}) => html`
			<div class="time" style="transform: translateX(${offset}px)">
				${time}
			</div>
		`)}
		</div>
	`
})
