import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/context.js"
import eyeSvg from "../../../../icons/gravity-ui/eye.svg.js"
import lockSvg from "../../../../icons/gravity-ui/lock.svg.js"
import volumeSvg from "../../../../icons/gravity-ui/volume.svg.js"
import eyeSlashSvg from "../../../../icons/gravity-ui/eye-slash.svg.js"
import lockOpenSvg from "../../../../icons/gravity-ui/lock-open.svg.js"
import volumeSlashSvg from "../../../../icons/gravity-ui/volume-slash.svg.js"
import {getEffectsOnTrack} from "../../../../context/controllers/timeline/utils/get-effects-on-track.js"

export const TrackSidebar = shadow_view(use => (index: number, trackId: string) => {
	use.styles(styles)
	use.watch(() => use.context.state)

	const state = use.context.state
	const isVisible = state.tracks.find(track => track.id === trackId)?.visible
	const isLocked = state.tracks.find(track => track.id === trackId)?.locked
	const isMuted = state.tracks.find(track => track.id === trackId)?.muted
	const track_effects = getEffectsOnTrack(use.context.state, index)

	const if_text_on_track_styles = () => {
		return track_effects.some(effect => effect.kind === "text") && !track_effects.some(effect => effect.kind !== "text")
			? `height: 30px;`
			: `height: 50px;`
	}

	return html`
		<div class="switches" style=${if_text_on_track_styles()}>
			<div class="items">
				<span class=index>${use.context.state.tracks.length - 1 - index}</span>
				<button ?data-active=${!isVisible} @click=${() => use.context.actions.toggle_track_visibility(trackId)}>${isVisible ? eyeSvg : eyeSlashSvg}</button>
				<button ?data-active=${isLocked} @click=${() => use.context.actions.toggle_track_locked(trackId)}>${isLocked ? lockSvg : lockOpenSvg}</button>
				<button ?data-active=${isMuted} @click=${() => use.context.actions.toggle_track_muted(trackId)}>${isMuted ? volumeSlashSvg : volumeSvg}</button>
			</div>
		</div>
	`
})
