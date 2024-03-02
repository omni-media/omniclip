import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"
import playheadSvg from "../../../../icons/remix-icon/playhead.svg.js"

export const Playhead = shadow_view({styles}, use => () => {
	use.watch(() => use.context.state.timeline)
	const controller = use.context.controllers.timeline
	const actions = use.context.actions.timeline_actions
	const playhead_drag = use.context.controllers.timeline.playhead_drag
	const [_pauseTime, setPauseTime, getPauseTime] = use.state(0)
	const [_lastTime, setLastTime, getLastTime] = use.state(0)

	use.setup(() => {
		let on_playhead_drag_active = true

		const on_playhead_drag = (now: number) => {
			if(use.context.controllers.timeline.playhead_drag.hovering) {
				const time = now - getPauseTime()
				const wait_time = time - getLastTime()
				if(wait_time > 100) {
					controller.on_playhead_drag.publish(0)
					setLastTime(time)
				}
			} else setPauseTime(now - getLastTime())
			if(on_playhead_drag_active) {requestAnimationFrame(on_playhead_drag)}
		}

		on_playhead_drag(0)

		return () => {
			on_playhead_drag_active = false
		}
	})

	const translate_to_timecode = (x: number) => {
		const zoom = use.context.state.timeline.zoom
		const milliseconds = x * Math.pow(2, -zoom)
		use.context.actions.timeline_actions.set_timecode(milliseconds)
	}

	const drag_events = {
		start(e: DragEvent) {
			const img = new Image()
			img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
			e.dataTransfer?.setDragImage(img, 0, 0)
			actions.set_is_playing(false)
			playhead_drag.dragzone.dragstart(true)(e)
		},
		drop: (e: DragEvent) => playhead_drag.dropzone.drop(playhead_drag.hovering!)(e),
		end: (e: DragEvent) => playhead_drag.dragzone.dragend()(e)
	}

	if(playhead_drag.hovering) {
		translate_to_timecode(playhead_drag.hovering.x)
	}

	const normalize_to_timebase = (timecode: number) => {
		const frame_duration = 1000/use.context.state.timeline.timebase
		const normalized = Math.round(((timecode)) / frame_duration) * frame_duration
		return normalized * Math.pow(2, use.context.state.timeline.zoom)
	}
	const normalized = normalize_to_timebase(use.context.state.timeline.timecode)

	return html`
		<div
			draggable="true"
			@dragstart=${drag_events.start}
			@drop=${drag_events.drop}
			@dragend=${drag_events.end}
			style="transform: translateX(${normalized}px);"
			class="playhead">
			<div class="head">${playheadSvg}</div>
		</div>
	`
})
