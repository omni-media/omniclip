import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"

export const MediaPlayer = shadow_view({styles}, use => () => {
	use.watch(() => use.context.state.timeline)
	const state = use.context.state.timeline
	const video = use.prepare(() => use.context.controllers.timeline.VideoOrchestrator)
	const playhead = use.context.controllers.timeline
	const [isVideoMuted, setIsVideoMuted] = use.state(false)

	video.on_playing(() => {
		const current_played_media_source = video.get_clip_relative_to_timecode(use.context.state.timeline)
		if(current_played_media_source?.item.type !== "Text")
			video.set_video_source(current_played_media_source?.item)
	})

	playhead.on_playhead_drag(() => {
		if(use.context.state.timeline.is_playing) {video.set_video_playing(false)}
		const current_played_media_source = video.get_clip_relative_to_timecode(use.context.state.timeline)
		const video_current_timecode = video.get_clip_current_time_relative_to_timecode(use.context.state.timeline)
		if(current_played_media_source?.item.type !== "Text") {
			video.set_video_source(current_played_media_source?.item)
			if(video_current_timecode) {
				video.draw_video_frame_at_certain_timecode(video_current_timecode)
			}
		}
	})

	return html`
		<figure>
			${video.canvas}
			<div id="video-controls" class="controls">
				<button @click=${video.toggle_video_playing} id="playpause" type="button" data-state="${state.is_playing ? 'pause' : 'play'}">Play/Pause</button>
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
