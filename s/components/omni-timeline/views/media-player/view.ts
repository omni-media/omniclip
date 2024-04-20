import {html, watch} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"
import playSvg from "../../../../icons/gravity-ui/play.svg.js"
import pauseSvg from "../../../../icons/gravity-ui/pause.svg.js"
import fullscreenSvg from "../../../../icons/gravity-ui/fullscreen.svg.js"
import {loadingPlaceholder} from "../../../../views/loading-placeholder/view.js"

export const MediaPlayer = shadow_view(use => () => {
	use.styles(styles)
	use.watch(() => use.context.state.timeline)
	const state = use.context.state.timeline
	const compositor = use.once(() => use.context.controllers.compositor)
	const playhead = use.context.controllers.timeline
	const [isVideoMuted, setIsVideoMuted] = use.state(false)

	use.mount(() => {
		const unsub_onplayhead = playhead.on_playhead_drag(() => {
			if(use.context.state.timeline.is_playing) {compositor.set_video_playing(false)}
			compositor.set_current_time_of_audio_or_video_and_redraw(true, use.context.state.timeline.timecode)
		})
		watch.track(
			() => use.context.state.timeline,
			(timeline) => {
				if(!timeline.is_exporting)
					compositor.compose_effects(timeline.effects, timeline.timecode)
			}
		)
		const unsub_on_playing = compositor.on_playing(() => compositor.compose_effects(use.context.state.timeline.effects, use.context.state.timeline.timecode))
		return () => {unsub_on_playing(), unsub_onplayhead()}
	})

	const figure = use.defer(() => use.shadow.querySelector("figure"))!

	const toggle_fullScreen = () => {
		if (!document.fullscreenElement) {
			figure.requestFullscreen()
		} else if (document.exitFullscreen) {
			document.exitFullscreen()
		}
	}

	return loadingPlaceholder(use.context.helpers.ffmpeg.is_loading.value, () => html`
		<div class="flex">
			<figure>
				<div class="canvas-container">
					${compositor.canvas.getSelectionElement()}
					${compositor.canvas.getElement()}
				</div>
				<div id="video-controls" class="controls">
					<button
						@click=${compositor.toggle_video_playing}
						id="playpause"
						type="button"
						data-state="${state.is_playing ? 'pause' : 'play'}"
					>
						${state.is_playing ? pauseSvg : playSvg}
					</button>
					<button @click=${toggle_fullScreen} class="fs" type="button" data-state="go-fullscreen">${fullscreenSvg}</button>
				</div>
			</figure>
		</div>
	`)
})
