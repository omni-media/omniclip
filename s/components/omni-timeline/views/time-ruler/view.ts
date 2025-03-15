import {GoldElement, html, watch} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/context.js"

export const TimeRuler = shadow_view(use => (timeline: GoldElement) => {
	use.styles(styles)
	const [timeCodes, setTimeCodes] = use.state<{time: string, offset: number, kind: "normal" | "dot"}[]>([])
	const [_, setPrevTimecode, getPrevTimecode] = use.state<null | number>(null)
	const [_p, setPrev, getPrev] = use.state<null | number>(null)
	const [indicatorX, setIndicatorX] = use.state(0)
	const [indicator, setIndicator] = use.state(false)

	use.mount(() => {
		const set_time_codes = () => setTimeCodes(generate_time_codes(use.context.state.zoom))
		watch.track(() => use.context.state.zoom, (zoom) => setTimeCodes(generate_time_codes(zoom)))
		timeline.addEventListener("scroll", set_time_codes)
		return () => timeline.removeEventListener("scroll",set_time_codes)
	})

	function convert_ms_to_timecode(milliseconds: number) {
		let seconds = Math.floor(milliseconds / 1000)
		let minutes = Math.floor(seconds / 60)
		seconds = seconds % 60
		const zoom_rounded = round_to_two_decimal_places(use.context.state.zoom)
		if(zoom_rounded <= -9) {
			return `${minutes}min`
		} else {
			return `${Math.floor((milliseconds/1000)*1000)/1000}s`
		}
	}

	function round_to_two_decimal_places(zoom: number) {
		return Math.round(zoom * 100) / 100
	}

	function round_timecode_to(timecode: number, zoom: number, ms: number) {
		const number_of_dots = Math.ceil(-zoom) / 2 // this equal one dot between, the larger the number to divide by the more dots
		const closestTimeCode = Math.round((timecode / (ms * Math.ceil(-zoom)))*number_of_dots)/number_of_dots * (ms * Math.ceil(-zoom))
		const offset = closestTimeCode / Math.pow(2, -zoom);
		if(closestTimeCode !== getPrevTimecode()) {
			setPrevTimecode(closestTimeCode)
			return {
				time: convert_ms_to_timecode(closestTimeCode),
				offset,
				kind: "normal"
			}
		} else {
			const closestTimeCode = Math.round((timecode / (ms * Math.ceil(-zoom)))*Math.ceil(-zoom))/Math.ceil(-zoom) * (ms * Math.ceil(-zoom))
			const offset = closestTimeCode / Math.pow(2, -zoom);
			if(closestTimeCode !== getPrev() && closestTimeCode !== getPrevTimecode()) {
				setPrev(closestTimeCode)
				return {
					time: convert_ms_to_timecode(closestTimeCode),
					offset,
					kind: "dot"
				}
			}
		}
	}

	function generate_time_codes(zoom: number): {
		offset: number,
		time: string
		kind: "normal" | "dot"
	}[] {
		const time_codes = []
		const ms = 1000/use.context.state.timebase
		const offsetLeft = use.element.offsetLeft + 50
		for(let time_code = timeline.scrollLeft; time_code <= timeline.scrollLeft + timeline.clientWidth - offsetLeft; time_code+=5) {
			const exact_time_code = time_code * Math.pow(2, -zoom)
			const zoom_rounded = round_to_two_decimal_places(zoom)
			if(zoom_rounded < 0) {
				if(zoom_rounded <= -13) {
					const timecode = round_timecode_to(exact_time_code, zoom, 60000 * 5)
					if(timecode) time_codes.push(timecode)
				}
				if(zoom_rounded <= -12 && zoom_rounded > -13) {
					const timecode = round_timecode_to(exact_time_code, zoom, 60000 * 4)
					if(timecode) time_codes.push(timecode)
				}
				if(zoom_rounded <= -11 && zoom_rounded > -12) {
					const timecode = round_timecode_to(exact_time_code, zoom, 60000 * 3)
					if(timecode) time_codes.push(timecode)
				}
				if(zoom_rounded <= -10 && zoom_rounded > -11) {
					const timecode = round_timecode_to(exact_time_code, zoom, 60000 * 2)
					if(timecode) time_codes.push(timecode)
				}
				if(zoom_rounded <= -9 && zoom_rounded > -10) {
					const timecode = round_timecode_to(exact_time_code, zoom, 60000)
					if(timecode) time_codes.push(timecode)
				}
				if(zoom_rounded <= -8 && zoom_rounded > -9) {
					const timecode = round_timecode_to(exact_time_code, zoom, 10000)
					if(timecode) time_codes.push(timecode)
				}
				if(zoom_rounded <= -7 && zoom_rounded > -8) {
					const timecode = round_timecode_to(exact_time_code, zoom, 5000)
					if(timecode) time_codes.push(timecode)
				}
				if(zoom_rounded <= -6 && zoom_rounded > -7) {
					const timecode = round_timecode_to(exact_time_code, zoom, 2000)
					if(timecode) time_codes.push(timecode)
				}
				if(zoom_rounded <= -4 && zoom_rounded > -6) {
					const timecode = round_timecode_to(exact_time_code, zoom, 1000)
					if(timecode) time_codes.push(timecode)
				}
				if(zoom_rounded < -2 && zoom_rounded > -4) {
					const timecode = round_timecode_to(exact_time_code, zoom, 500)
					if(timecode) time_codes.push(timecode)
				}
				if(zoom_rounded >= -2) {
					const timecode = round_timecode_to(exact_time_code, zoom, 100)
					if(timecode) time_codes.push(timecode)
				}
			}
			if(zoom_rounded >= 0) {
				const closestTimeCode = Math.round(exact_time_code / ms) * ms
				const offset = closestTimeCode / Math.pow(2, -zoom)
				if(closestTimeCode !== getPrevTimecode()) {
					time_codes.push({
						time: convert_ms_to_timecode(closestTimeCode),
						offset,
						kind: "normal"
					})
					setPrevTimecode(closestTimeCode)
				}
			} 
		}
		return time_codes as any
	}

	const translate_to_timecode_and_set = (x: number) => {
		const zoom = use.context.state.zoom
		const milliseconds = x * Math.pow(2, -zoom)
		use.context.actions.set_timecode(milliseconds, {omit: true})
		use.context.controllers.timeline.playheadDragHandler.onPlayheadMove.publish({x})
	}

	return html`
		<div
			@pointerenter=${() => setIndicator(true)}
			@pointerleave=${() => setIndicator(false)}
			@pointermove=${(e: PointerEvent) => setIndicatorX(e.clientX - timeline.getBoundingClientRect().left + timeline.scrollLeft)}
			@pointerdown=${(e: PointerEvent) => setIndicatorX(e.clientX - timeline.getBoundingClientRect().left + timeline.scrollLeft)}
			@pointerup=${(e: MouseEvent) => translate_to_timecode_and_set(e.clientX - timeline.getBoundingClientRect().left + timeline.scrollLeft)}
			class=time-ruler
		>
			<div style="transform: translateX(${indicatorX}px); display: ${indicator ? "block" : "none"};" class="indicator"></div>
			${timeCodes.map(({time, offset, kind}, i) => html`
			<div class="time ${kind}" style="transform: translateX(${offset}px); ${i === 0 ? "margin-left: 10px;" : ""}">
				<div class="content">${kind === "normal" ? time : null}</div>
			</div>
			`)}
		</div>
	`
})
