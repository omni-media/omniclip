import {html} from "lit"
import {shadow, useCss} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../../../../../../../../theme.css.js"
import binSvg from "../../../../../../../icons/gravity-ui/bin.svg.js"
import playSvg from "../../../../../../../icons/gravity-ui/play.svg.js"
import {EditorContext} from "../../../../../../../../context/context.js"
import pauseSvg from "../../../../../../../icons/gravity-ui/pause.svg.js"
import scissorsSvg from "../../../../../../../icons/gravity-ui/scissors.svg.js"
import redoSvg from "../../../../../../../icons/material-design-icons/redo.svg.js"
import undoSvg from "../../../../../../../icons/material-design-icons/undo.svg.js"
import zoomInSvg from "../../../../../../../icons/material-design-icons/zoom-in.svg.js"
import zoomOutSvg from "../../../../../../../icons/material-design-icons/zoom-out.svg.js"

export const Toolbar = shadow((context: EditorContext) => {
	useCss(themeCss, styleCss)
	const session = context.session
	const isPlaying = session.playback.$isPlaying()
	const rate = session.playback.$rate()

	const handleReverse = () => {
		session.playback.shuttle(-1)
	}

	const handlePlayPause = () => {
		session.playback.toggle()
	}

	const handleForward = () => {
		session.playback.shuttle(1)
	}

	const handleSplit = () => {
		session.splitAtPlayhead()
	}

	const handleClipDelete = () => {
		session.deleteClip(session.$selectedItem.value)
	}

	const setZoomAtPlayhead = (zoom: number) => {
		session.viewport.setZoomAt(session.playheadViewportX(), zoom)
	}

	const adjustZoomAtPlayhead = (delta: number) => {
		session.viewport.adjustZoomAt(session.playheadViewportX(), delta)
	}

	return html`
		<div class="toolbar">
			<div class="toolbar-section left">
				<div class="button-group">
					<button @click=${context.undo} ?disabled=${context.strata.timeline.undoable === 0}>
						${undoSvg}
					</button>
					<button @click=${context.redo} ?disabled=${context.strata.timeline.redoable === 0}>
						${redoSvg}
					</button>
				</div>
				<div class="button-group">
					<button
						?disabled=${!session.$selectedItem.value}
						@click=${handleClipDelete}
						title="Delete Clip"
					>
						${binSvg}
					</button>
					<button
						?disabled=${!session.$selectedItem.value}
						@click=${handleSplit}
						title="Split Clip (Cmd+B)"
					>
						${scissorsSvg}
					</button>
				</div>
			</div>

			<div class="toolbar-section center">
				<div class="button-group transport-controls">
					<button
						class="transport-button reverse"
						@click=${handleReverse}
						title="Play Reverse (J)"
						?data-active=${isPlaying && rate < 0}
					>
						${playSvg}
						<span>${isPlaying && rate < 0 ? `${Math.abs(rate)}x` : ""}</span>
					</button>
					<button
						class="play-pause"
						@click=${handlePlayPause}
						title="Play/Pause (Space)"
					>
						${isPlaying ? pauseSvg : playSvg}
					</button>
					<button
						class="transport-button"
						@click=${handleForward}
						title="Play Forward (L)"
						?data-active=${isPlaying && rate > 0}
					>
						${playSvg}
						<span>${isPlaying && rate > 0 ? `${rate}x` : ""}
						</span>
					</button>
				</div>
			</div>

			<div class="toolbar-section right">
				<div class="zoom-controls">
					<button class="zoom-button" @click=${() => adjustZoomAtPlayhead(-0.1)}>
						${zoomOutSvg}
					</button>
					<input
						type="range"
						class="zoom-slider"
						min="0.2"
						max="10"
						step="0.1"
						.value=${session.viewport.zoom}
						@input=${(e: Event) => setZoomAtPlayhead(+(e.currentTarget as HTMLInputElement).value)}
					>
					<button class="zoom-button" @click=${() => adjustZoomAtPlayhead(0.1)}>
						${zoomInSvg}
					</button>
				</div>
			</div>
		</div>
	`
})
