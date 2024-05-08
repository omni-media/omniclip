import {Op, html, watch} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/context.js"
import playSvg from "../../../../icons/gravity-ui/play.svg.js"
import pauseSvg from "../../../../icons/gravity-ui/pause.svg.js"
import {TextUpdater} from "../../../../views/text-updater/view.js"
import {StateHandler} from "../../../../views/state-handler/view.js"
import fullscreenSvg from "../../../../icons/gravity-ui/fullscreen.svg.js"

export const MediaPlayer = shadow_view(use => () => {
	use.styles(styles)
	use.watch(() => use.context.state)
	const state = use.context.state
	const compositor = use.once(() => use.context.controllers.compositor)
	const playhead = use.context.controllers.timeline
	const [isVideoMuted, setIsVideoMuted] = use.state(false)

	use.mount(() => {
		const unsub_onplayhead = playhead.on_playhead_drag(() => {
			if(use.context.state.is_playing) {compositor.set_video_playing(false)}
			compositor.set_current_time_of_audio_or_video_and_redraw(true, use.context.state.timecode)
		})
		const dispose1 = watch.track(
			() => use.context.state,
			(timeline) => {
				if(!timeline.is_exporting) {
					compositor.compose_effects(timeline.effects, timeline.timecode)
					if(!timeline.is_playing) {
						compositor.set_current_time_of_audio_or_video_and_redraw(true, use.context.state.timecode)
					} else {
						compositor.set_current_time_of_audio_or_video_and_redraw(false, use.context.state.timecode)
					}
				}
			}
		)
		const dispose2 = watch.track(
			() => use.context.state.timecode,
			(timecode) => {
				const selected_effect = use.context.state.selected_effect
				if(selected_effect) {
					use.context.controllers.timeline.set_or_discard_active_object_on_canvas_for_selected_effect(selected_effect, compositor, use.context.state)
				}
			}
		)
		const unsub_on_playing = compositor.on_playing(() => compositor.compose_effects(use.context.state.effects, use.context.state.timecode))
		return () => {unsub_on_playing(), unsub_onplayhead(), dispose1(), dispose2()}
	})

	const figure = use.defer(() => use.shadow.querySelector("figure"))!

	const toggle_fullScreen = () => {
		if (!document.fullscreenElement) {
			figure.requestFullscreen()
		} else if (document.exitFullscreen) {
			document.exitFullscreen()
		}
	}

	return StateHandler(Op.all(
		use.context.helpers.ffmpeg.is_loading.value,
		use.context.is_webcodecs_supported.value), () => html`
		<div class="flex">
			<figure>
				<div class="canvas-container">
					${use.context.state.selected_effect?.kind === "text" && compositor.canvas.getActiveObject()
					? TextUpdater([use.context.state.selected_effect])
					: null}
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
