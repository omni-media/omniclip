import {html, reactor} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"
import {TextPositioner} from "../../../../views/text-positioner/view.js"

export const MediaPlayer = shadow_view({styles}, use => () => {
	use.watch(() => use.context.state.timeline)
	const state = use.context.state.timeline
	const compositor = use.prepare(() => use.context.controllers.compositor)
	const playhead = use.context.controllers.timeline
	const [isVideoMuted, setIsVideoMuted] = use.state(false)

	use.setup(() => {
		const unsub_onplayhead = playhead.on_playhead_drag(() => {
			if(use.context.state.timeline.is_playing) {compositor.set_video_playing(false)}
			compositor.update_currently_played_effects(use.context.state.timeline)
			compositor.draw_effects(true, use.context.state.timeline.timecode)
		})
		reactor.reaction(
			() => use.context.state.timeline,
			(timeline) => compositor.update_currently_played_effects(timeline))
		const unsub_on_playing = compositor.on_playing(() => compositor.update_currently_played_effects(use.context.state.timeline))
		return () => {unsub_on_playing(), unsub_onplayhead()}
	})

	return html`
		<figure>
			${TextPositioner([])}
			${compositor.canvas}
			<div id="video-controls" class="controls">
				<button @click=${compositor.toggle_video_playing} id="playpause" type="button" data-state="${state.is_playing ? 'pause' : 'play'}">Play/Pause</button>
				<button id="stop" type="button" data-state="stop">Stop</button>
				<button id="mute" type="button" data-state="${isVideoMuted ? 'unmute' : 'mute'}">Mute/Unmute</button>
				<button id="volinc" type="button" data-state="volup">Vol+</button>
				<button id="voldec" type="button" data-state="voldown">Vol-</button>
				<button id="fs" type="button" data-state="go-fullscreen">Fullscreen</button>
			</div>
		</figure>
		<div>${use.context.state.timeline.timecode}</div>
	`
})
