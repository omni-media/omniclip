import {Op, html, watch} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/context.js"
import playSvg from "../../../../icons/gravity-ui/play.svg.js"
import checkSvg from "../../../../icons/gravity-ui/check.svg.js"
import pauseSvg from "../../../../icons/gravity-ui/pause.svg.js"
import {TextUpdater} from "../../../../views/text-updater/view.js"
import {StateHandler} from "../../../../views/state-handler/view.js"
import fullscreenSvg from "../../../../icons/gravity-ui/fullscreen.svg.js"
import pencilSquareSvg from "../../../../icons/gravity-ui/pencil-square.svg.js"

export const MediaPlayer = shadow_view(use => () => {
	use.styles(styles)
	use.watch(() => use.context.state)
	const state = use.context.state
	const compositor = use.once(() => use.context.controllers.compositor)
	const playhead = use.context.controllers.timeline.playheadDragHandler
	const [isVideoMuted, setIsVideoMuted] = use.state(false)

	use.mount(() => {
		const unsub_onplayhead1 = playhead.onPlayheadMove(() => {
			compositor.managers.animationManager.seek(use.context.state.timecode)
		})
		const unsub_onplayhead = playhead.onPlayheadMoveThrottled(() => {
			if(use.context.state.is_playing) {compositor.set_video_playing(false)}
			compositor.seek(use.context.state.timecode, true)
			compositor.compose_effects(use.context.state.effects, use.context.state.timecode)
		})
		const dispose1 = watch.track(
			() => use.context.state,
			async (timeline) => {
				const files_ready = await use.context.controllers.media.are_files_ready()
				if(!timeline.is_exporting && files_ready) {
					if(timeline.is_playing) {
						compositor.managers.animationManager.seek(use.context.state.timecode)
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
					use.context.controllers.timeline.set_or_discard_active_object_on_canvas_for_selected_effect(selected_effect, compositor, use.context.state)
				}
			}
		)
		const unsub_on_playing = compositor.on_playing(() => compositor.compose_effects(use.context.state.effects, use.context.state.timecode))
		return () => {unsub_on_playing(), unsub_onplayhead(), dispose1(), dispose2(), unsub_onplayhead1()}
	})

	const figure = use.defer(() => use.shadow.querySelector("figure"))!

	const toggle_fullScreen = () => {
		if (!document.fullscreenElement) {
			figure.requestFullscreen()
		} else if (document.exitFullscreen) {
			document.exitFullscreen()
		}
	}

	const [renameDisabled, setRenameDisabled] = use.state(true)
	const toggleProjectRename = (e: PointerEvent) => {
		e.preventDefault()
		setRenameDisabled(!renameDisabled)
	}

	const confirmProjectRename = () => {
		const projectName = use.shadow.querySelector(".input-name") as HTMLInputElement
		use.context.actions.set_project_name(projectName.value)
	}

	return StateHandler(Op.all(
		use.context.helpers.ffmpeg.is_loading.value,
		use.context.is_webcodecs_supported.value), () => html`
		<div class="flex">
			<div class="project-name">
				<span class="box">
					<input class="input-name" ?disabled=${renameDisabled} .value=${use.context.state.projectName}>
					<span class="icons" @click=${toggleProjectRename}>
						${renameDisabled ? html`${pencilSquareSvg}` : html`<span @click=${confirmProjectRename} class="check">${checkSvg}</span>`}
					</span>
				</span>
			</div>
			<figure>
				<div class="canvas-container">
					${use.context.state.selected_effect?.kind === "text" && compositor.canvas.getActiveObject()
					? TextUpdater([use.context.state.selected_effect])
					: null}
					${compositor.canvas.getSelectionElement()}
					${compositor.canvas.getElement()}
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
