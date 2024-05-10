import {GoldElement, html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/context.js"
import binSvg from "../../../../icons/gravity-ui/bin.svg.js"
import scissorsSvg from "../../../../icons/gravity-ui/scissors.svg.js"
import undoSvg from "../../../../icons/material-design-icons/undo.svg.js"
import redoSvg from "../../../../icons/material-design-icons/redo.svg.js"
import zoomInSvg from "../../../../icons/material-design-icons/zoom-in.svg.js"
import {convert_ms_to_hmsms} from "../time-ruler/utils/convert_ms_to_hmsms.js"
import zoomOutSvg from "../../../../icons/material-design-icons/zoom-out.svg.js"

export const Toolbar = shadow_view(use => (timeline: GoldElement) => {
	use.styles(styles)
	use.watch(() => use.context.state)
	const actions = use.context.actions
	const zoom = use.context.state.zoom
	const controller = use.context.controllers.timeline

	use.mount(() => {
		const observer = new ResizeObserver(() => use.rerender())
		observer.observe(timeline)
		return () => observer.disconnect()
	})

	return html`
		<div class="toolbar">
			<div style="width: ${timeline.offsetWidth}px;" class=tools>
				<div class=flex>
					<div class=history>
						<button ?data-past=${use.context.history.past.length !== 0} @click=${() => use.context.undo(use.context.state)}>${undoSvg}</button>
						<button ?data-future=${use.context.history.future.length !== 0} @click=${() => use.context.redo(use.context.state)}>${redoSvg}</button>
					</div>
					<button @click=${() => controller.split(use.context.state)} class="split">${scissorsSvg}</button>
					<button class="remove" ?disabled=${!use.context.state.selected_effect} @click=${() => controller.remove_selected_effect(use.context.state)}>
						${binSvg}
					</button>
				</div>
				<div>${convert_ms_to_hmsms(use.context.state.timecode)}</div>
				<div class="zoom">
					<button ?disabled=${zoom >= 2} @click=${actions.zoom_in} class="zoom-in">${zoomInSvg}</button>
					<button ?disabled=${zoom <= -13} @click=${actions.zoom_out} class="zoom-out">${zoomOutSvg}</button>
				</div>
			</div>
		</div>
	`
})
