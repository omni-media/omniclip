import {Op, html, watch} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/context.js"
import playSvg from "../../../../icons/gravity-ui/play.svg.js"
import pauseSvg from "../../../../icons/gravity-ui/pause.svg.js"
import {StateHandler} from "../../../../views/state-handler/view.js"
import fullscreenSvg from "../../../../icons/gravity-ui/fullscreen.svg.js"

export const MediaPlayer = shadow_view(use => () => {
	use.styles(styles)
	use.watch(() => use.context.state)
	const state = use.context.state
	const compositor = use.once(() => use.context.controllers.compositor)
	const playhead = use.context.controllers.timeline.playheadDragHandler

	use.mount(() => {
		const unsub_onplayhead1 = playhead.onPlayheadMove(async (x) => {
			if(use.context.state.is_playing) {compositor.set_video_playing(false)}
			compositor.compose_effects(use.context.state.effects, use.context.state.timecode)
			compositor.seek(use.context.state.timecode, true).then(() =>
				compositor.compose_effects(use.context.state.effects, use.context.state.timecode)
			)
		})
		const dispose1 = watch.track(
			() => use.context.state,
			async (timeline) => {
				const files_ready = await use.context.controllers.media.are_files_ready()
				if(!timeline.is_exporting && files_ready) {
					if(timeline.is_playing) {
						compositor.seek(use.context.state.timecode, false)
					}
				}
			}
		)
		const dispose2 = watch.track(
			() => use.context.state.timecode,
			(timecode) => {
				const selected_effect = use.context.state.selected_effect
				if(selected_effect) {
					use.context.controllers.compositor.setOrDiscardActiveObjectOnCanvas(selected_effect, use.context.state)
				}
			}
		)
		const unsub_on_playing = compositor.on_playing(() => compositor.compose_effects(use.context.state.effects, use.context.state.timecode))
		return () => {unsub_on_playing(), dispose1(), dispose2(), unsub_onplayhead1()}
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
				<div class="canvas-container" style="aspect-ratio: ${state.settings.width}/${state.settings.height};">
					${!state.is_exporting
						? html`${compositor.app.view}`
						: null}
				</div>
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
				<button @click=${toggle_fullScreen} class="fs" type="button" data-state="go-fullscreen">${fullscreenSvg}</button>
			</div>
		</div>
	`)
})
