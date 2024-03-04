import {GoldElement, html, watch} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"

export const TimeRuler = shadow_view({styles}, use => (timeline: GoldElement) => {
	const [timeCodes, setTimeCodes] = use.state<{time: string, offset: number}[]>([])
	const [_, setPrevTimecode, getPrevTimecode] = use.state<null | number>(null)

	use.setup(() => {
		const set_time_codes = () => setTimeCodes(generate_time_codes(use.context.state.timeline.zoom))
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
		const zoom_rounded = roundToTwoDecimalPlaces(use.context.state.timeline.zoom)
		if(zoom_rounded > -6) {
			return `${milliseconds/1000}s`
		} else {
			return `${minutes}.${seconds}m`
		}
	}

function roundToTwoDecimalPlaces(zoom: number) {
  return Math.round(zoom * 100) / 100;
}

function round_timecode_to(timecode: number, zoom: number, ms: number) {
	const closestTimeCode = Math.round(timecode / (ms * Math.ceil(-zoom))) * (ms * Math.ceil(-zoom))
	const offset = closestTimeCode / Math.pow(2, -zoom);
	// let seconds = Math.floor(timecode / 1000)
	// seconds = seconds % 60
	// console.log(closestTimeCode, seconds, ms, offset)
	// console.log(zoom)
	if(closestTimeCode !== getPrevTimecode()) {
		setPrevTimecode(closestTimeCode)
		return {
			time: convert_ms_to_hms(closestTimeCode),
			offset
		}
	}
}

	function generate_time_codes(zoom: number) {
		const time_codes = []
		const ms = 1000/use.context.state.timeline.timebase
		for(let time_code = timeline.scrollLeft; time_code <= timeline.scrollLeft + timeline.clientWidth; time_code+=10) {
			const exactTimeCode = time_code * Math.pow(2, -zoom)
			const zoom_rounded = roundToTwoDecimalPlaces(zoom)
			if(zoom_rounded < 0) {
				if(zoom_rounded <= -12) {
					const timecode = round_timecode_to(exactTimeCode, zoom, 60000)
					if(timecode) time_codes.push(timecode)
				}
				if(zoom_rounded <= -10 && zoom_rounded > -12) {
					const timecode = round_timecode_to(exactTimeCode, zoom, 30000)
					if(timecode) time_codes.push(timecode)
				}
				if(zoom_rounded <= -8 && zoom_rounded > -10) {
					const timecode = round_timecode_to(exactTimeCode, zoom, 10000)
					if(timecode) time_codes.push(timecode)
				}
				if(zoom_rounded <= -6 && zoom_rounded > -8) {
					const timecode = round_timecode_to(exactTimeCode, zoom, 5000)
					if(timecode) time_codes.push(timecode)
				}
				if(zoom_rounded <= -4 && zoom_rounded > -6) {
					const timecode = round_timecode_to(exactTimeCode, zoom, 1000)
					if(timecode) time_codes.push(timecode)
				}
				if(zoom_rounded < -2 && zoom_rounded > -4) {
					const timecode = round_timecode_to(exactTimeCode, zoom, 500)
					if(timecode) time_codes.push(timecode)
				}
				if(zoom_rounded >= -2) {
					const timecode = round_timecode_to(exactTimeCode, zoom, 100)
					if(timecode) time_codes.push(timecode)
				}
			}
			if(zoom_rounded >= 0) {
				const closestTimeCode = Math.round(exactTimeCode / ms) * ms
				const offset = closestTimeCode / Math.pow(2, -zoom)
				if(closestTimeCode !== getPrevTimecode()) {
					time_codes.push({
						time: convert_ms_to_hms(closestTimeCode),
						offset
					})
					setPrevTimecode(closestTimeCode)
				}
			} 
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
