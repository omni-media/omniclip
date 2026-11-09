
import {html} from "lit"
import {Kind} from "@omnimedia/omnitool"
import {repeat} from "lit/directives/repeat.js"
import {shadow, useCss, useSignal} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../../../../../../theme.css.js"
import {Idx} from "../../../../../logic/parts/index.js"
import {EditorContext} from "../../../../../../context/context.js"
import {itemLabel} from "../../../../../logic/utils/item-label.js"
import exportSvg from "../../../../../icons/gravity-ui/export.svg.js"

export const ExportTab = shadow((context: EditorContext) => {
	useCss(themeCss, styleCss)

	const {timeline} = context.strata
	const selectedItemId = useSignal(timeline.state.rootId)
	const itemsMap = new Map(timeline.state.items.map(i => [i.id, i]))
	const items = timeline.state.items.filter(item => Idx.isStruct(item) || Idx.isClip(item.kind))
	const selectedItem = itemsMap.get(selectedItemId())

	const progress = 0
	const isExporting = false

	const handleExport = () => {}

	return html`
		<div class="export-container">
			<div class="panel items-panel">
				<h4>Timeline items</h4>
				<div class="list">
					${repeat(items, item => item.id, item => html`
						<button
							class="item-card"
							?data-selected=${item.id === selectedItemId()}
							@click=${() => selectedItemId(item.id)}
						>
							<span class="label">${itemLabel(item)}</span>
							<span class="kind">${Kind[item.kind]}</span>
						</button>
					`)}
					${items.length === 0 ? html`
						<p class="empty-state">No timeline items.</p>
					` : null}
				</div>
			</div>

			<div class="panel settings-panel">
				<h4>Export Settings</h4>
				<div class="settings-group">
					<label for="format">Format</label>
					<select id="format">
						<option>MP4 (H.264)</option>
					</select>
				</div>
				<div class="settings-group">
					<label for="resolution">Resolution</label>
					<select id="resolution">
						<option>1080p (Full HD)</option>
						<option>720p (HD)</option>
						<option>480p (SD)</option>
					</select>
				</div>
				<div class="settings-group">
					<label for="quality">Quality</label>
					<select id="quality">
						<option>High</option>
						<option>Medium</option>
						<option>Low</option>
					</select>
				</div>

				<div class="export-action">
					${isExporting ? html`
						<div class="progress-bar">
							<div class="progress-fill" style="width: ${progress}%"></div>
							<span>Exporting... ${progress}%</span>
						</div>
					` : html`
						<button class="export-button" @click=${handleExport} ?disabled=${!selectedItem}>
							${exportSvg}
							<span>Export "${selectedItem ? itemLabel(selectedItem) : "item"}"</span>
						</button>
					`}
				</div>
			</div>
		</div>
	`
})
