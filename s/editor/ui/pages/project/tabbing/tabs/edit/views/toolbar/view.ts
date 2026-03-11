import {html} from "lit"
import {view} from "@e280/sly"

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

export const Toolbar = view(use => (context: EditorContext) => {
	use.styles(themeCss, styleCss)
	const session = context.session
	const isPlaying = use.signal(false)
	const canUndo = false
	const canRedo = false
	const player = context.controllers.player

	use.mount(() => {
		const dispose = isPlaying.on(async (v) => {
			if(v)
				await player.play()
			else player.pause()
		})
		return () => dispose()
	})

	const handleSplit = () => {
		if(session.$selectedItem.value) {
			session.splitClipAt(
				session.$selectedItem.value,
				session.getPlayheadInMs()
			)
		}
	}

	const handleClipDelete = () => {
		if(session.$selectedItem.value) {
			session.deleteClip(session.$selectedItem.value)
		}
	}

	return html`
		<div class="toolbar">
			<div class="toolbar-section left">
				<div class="button-group">
					<button @click=${() => console.log("undo")} ?disabled=${!canUndo}>
						${undoSvg}
					</button>
					<button @click=${() => console.log("redo")} ?disabled=${!canRedo}>
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
						title="Split Clip (S)"
					>
						${scissorsSvg}
					</button>
				</div>
			</div>

			<div class="toolbar-section center">
				<div class="button-group">
					<button
						class="play-pause"
						@click=${() => isPlaying.value = !isPlaying.value}>
						${isPlaying.value ? pauseSvg : playSvg}
					</button>
				</div>
			</div>

			<div class="toolbar-section right">
				<div class="zoom-controls">
					<button class="zoom-button" @click=${() => session.$zoom.value -= 0.1}>
						${zoomOutSvg}
					</button>
					<input
						type="range"
						class="zoom-slider"
						min="0.2"
						max="10"
						step="0.1"
						.value=${session.$zoom.value}
						@input=${(e: Event) => session.$zoom.value = +(e.currentTarget as HTMLInputElement).value}
					>
					<button class="zoom-button" @click=${() => session.$zoom.value += 0.1}>
						${zoomInSvg}
					</button>
				</div>
			</div>
		</div>
	`
})

