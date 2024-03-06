import {html, reactor} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"
import playSvg from "../../../../icons/gravity-ui/play.svg.js"
import pauseSvg from "../../../../icons/gravity-ui/pause.svg.js"
import {TextPositioner} from "../../../../views/text-positioner/view.js"
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
			compositor.update_currently_played_effects(use.context.state.timeline)
			compositor.draw_effects(true, use.context.state.timeline.timecode)
		})
		reactor.reaction(
			() => use.context.state.timeline,
			(timeline) => compositor.update_currently_played_effects(timeline))
		const unsub_on_playing = compositor.on_playing(() => compositor.update_currently_played_effects(use.context.state.timeline))
		return () => {unsub_on_playing(), unsub_onplayhead()}
	})

	return loadingPlaceholder(use.context.helpers.ffmpeg.is_loading.value, () => html`
		<div class="flex">
			<figure>
				${TextPositioner([])}
				${compositor.canvas}
			</figure>
			<div id="video-controls" class="controls">
				<button
					@click=${compositor.toggle_video_playing}
					id="playpause"
					type="button"
					data-state="${state.is_playing ? 'pause' : 'play'}"
				>
					${state.is_playing ? pauseSvg : playSvg}
				</button>
				<button class="fs" type="button" data-state="go-fullscreen">${fullscreenSvg}</button>
			</div>
		</div>
	`)
})
