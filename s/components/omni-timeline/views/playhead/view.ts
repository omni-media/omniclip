import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {V2} from "../../utils/coordinates_in_rect.js"
import {shadow_view} from "../../../../context/slate.js"

export const Playhead = shadow_view({styles}, use => (coordinates: V2) => {
	use.watch(() => use.context.state.timeline)
	const controller = use.context.controllers.timeline
	const state = use.context.state.timeline
	const actions = use.context.actions.timeline_actions
	const playhead_drag = use.context.controllers.timeline.playhead_drag
	const [onPlayingLoop, setOnPlayingLoop] = use.state<number>(0)
	const [_lastTime, setLastTime, getLastTime] = use.state(0)

	const publish_on_playing_loop = () => {
		const clip_relative_to_timecode = controller.get_clip_relative_to_timecode(state)
		const lastTime = getLastTime()
		const now = performance.now()
		const elapsed_time = now - lastTime
		actions.increase_timecode(elapsed_time)
		controller.on_playing.publish(clip_relative_to_timecode)
		setOnPlayingLoop(requestAnimationFrame(publish_on_playing_loop))
		setLastTime(now)
	}

	if(state.is_playing) {
		publish_on_playing_loop()
	} else cancelAnimationFrame(onPlayingLoop)

	const translate_to_timecode = (x: number) => {
		const zoom = use.context.state.timeline.zoom
		const milliseconds = x * Math.pow(2, -zoom)
		use.context.actions.timeline_actions.set_timecode(milliseconds)
	}

	const drag_events = {
		start(e: DragEvent) {
			actions.set_is_playing(false)
			playhead_drag.dragzone.dragstart(true)(e)
		},
		drop: (e: DragEvent) => playhead_drag.dropzone.drop(playhead_drag.hovering!)(e)
	}

	if(playhead_drag.hovering) {translate_to_timecode(coordinates[0])}

	return html`
		<div
			@dragstart=${drag_events.start}
			@drop=${drag_events.drop}
			style="transform: translateX(${use.context.state.timeline.timecode * Math.pow(2, use.context.state.timeline.zoom)}px);"
			class="playhead">
			<div class="head"></div>
		</div>
	`
})
