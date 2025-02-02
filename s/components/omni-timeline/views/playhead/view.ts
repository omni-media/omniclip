import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/context.js"
import playheadSvg from "../../../../icons/remix-icon/playhead.svg.js"

export const Playhead = shadow_view(use => () => {
	use.styles(styles)
	use.watch(() => use.context.state)
	const actions = use.context.actions
	const playheadDrag = use.context.controllers.timeline.playheadDragHandler

	use.mount(() => {
		const dispose = playheadDrag.onPlayheadMove(({x}) => translate_to_timecode(x))
		return () => dispose()
	})

	const translate_to_timecode = (x: number) => {
		const zoom = use.context.state.zoom
		const milliseconds = x * Math.pow(2, -zoom)
		use.context.actions.set_timecode(milliseconds, {omit: true})
	}

	const events = {
		start() {
			actions.set_is_playing(false, {omit: true})
			playheadDrag.start()
		},
		drop: () => playheadDrag.drop(),
		end: () => playheadDrag.end()
	}

	use.mount(() => {
		window.addEventListener("pointercancel", events.end)
		window.addEventListener("pointerup", events.drop)
		return () => {removeEventListener("pointerup", events.drop); removeEventListener("pointercancel", events.end)}
	})

	const normalize_to_timebase = (timecode: number) => {
		const frame_duration = 1000/use.context.state.timebase
		const normalized = Math.round(((timecode)) / frame_duration) * frame_duration
		return normalized * Math.pow(2, use.context.state.zoom)
	}
	const normalized = normalize_to_timebase(use.context.state.timecode)

	return html`
		<div
			@pointerdown=${events.start}
			@pointerup=${events.drop}
			@pointercancel=${events.end}
			style="transform: translateX(${normalized}px);"
			class="playhead">
			<div class="head">${playheadSvg}</div>
		</div>
	`
})
