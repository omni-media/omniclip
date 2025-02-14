import {GoldElement, html} from "@benev/slate"

import {styles} from "./styles.js"
import {Tooltip} from "../../../../views/tooltip/view.js"
import {shadow_view} from "../../../../context/context.js"
import binSvg from "../../../../icons/gravity-ui/bin.svg.js"
import {tooltipStyles} from "../../../../views/tooltip/styles.js"
import cleanSvg from "../../../../icons/carbon-icons/clean.svg.js"
import scissorsSvg from "../../../../icons/gravity-ui/scissors.svg.js"
import undoSvg from "../../../../icons/material-design-icons/undo.svg.js"
import redoSvg from "../../../../icons/material-design-icons/redo.svg.js"
import zoomInSvg from "../../../../icons/material-design-icons/zoom-in.svg.js"
import {convert_ms_to_hmsms} from "../time-ruler/utils/convert_ms_to_hmsms.js"
import zoomOutSvg from "../../../../icons/material-design-icons/zoom-out.svg.js"

export const Toolbar = shadow_view(use => (timeline: GoldElement) => {
	use.styles([styles, tooltipStyles])
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
			<div class=tools>
				<div class=flex>
					<div class=history>
						${Tooltip(
							html`
								<button
									?disabled=${use.context.history.past.length === 0}
									?data-past=${use.context.history.past.length !== 0}
									@click=${() => {
										use.context.undo()
										use.rerender()
									}}
								>
									${undoSvg}
								</button>
							`,
							html`<span>Undo</span>`
						)}
						${Tooltip(
							html`
								<button
									?disabled=${use.context.history.future.length === 0}
									?data-future=${use.context.history.future.length !== 0}
									@click=${() => {
										use.context.redo()
										use.rerender()
									}}
								>
									${redoSvg}
								</button>
							`,
							html`<span>Redo</span>`
						)}
					</div>
					${Tooltip(
						html`
							<button
								@click=${() => controller.split(use.context.state)}
								class="split"
							>
								${scissorsSvg}
							</button>
						`,
						html`<span>Split</span>`
					)}
					${Tooltip(
						html`
							<button
								class="remove"
								?disabled=${!use.context.state.selected_effect}
								@click=${() => controller.remove_selected_effect(use.context.state)}
							>
								${binSvg}
							</button>`,
						html`<span>Delete</span>`
					)}
					${Tooltip(
						html`
							<button
								@click=${() => use.context.clear_project()}
								class="clean"
							>
								${cleanSvg}
							</button>`,
						html`<span>Clear Timeline</span>`
					)}
				</div>
				<div class=time>${convert_ms_to_hmsms(use.context.state.timecode)}</div>
				<div class="zoom">
					${Tooltip(
						html`
							<button
								?disabled=${zoom >= 2}
								@click=${() => actions.zoom_in({omit: true})}
								class="zoom-in"
							>
								${zoomInSvg}
							</button>`,
						html`<span>Zoom in</span>`
					)}
					${Tooltip(
						html`
							<button
								?disabled=${zoom <= -13}
								@click=${() => actions.zoom_out({omit: true})}
								class="zoom-out"
							>
								${zoomOutSvg}
							</button>
						`,
						html`<span>Zoom out</span>`
					)}
				</div>
			</div>
		</div>
	`
})
