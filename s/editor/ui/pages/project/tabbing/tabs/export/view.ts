import {html} from "lit"
import {view} from "@e280/sly"
import {Kind} from "@omnimedia/omnitool"
import {repeat} from "lit/directives/repeat.js"

import styleCss from "./style.css.js"
import themeCss from "../../../../../../theme.css.js"
import {EditorContext} from "../../../../../../context/context.js"
import exportSvg from "../../../../../icons/gravity-ui/export.svg.js"

export const ExportTab = view(use => (context: EditorContext) => {
	use.styles(themeCss, styleCss)

	const {timeline, outliner} = context.strata

	// const {starredItems, itemLabels} = viewState.state
	// const {isExporting, progress} = exportState.state

	const starredItems = outliner.state.items.filter(item => item.starred)
	const selectedItemId = use.signal(outliner.state.items[0]?.itemId ?? null)
	const itemLabels = ["example.mp4"]

	const itemsMap = new Map(timeline.state.timeline?.items.map(i => [i.id, i]))
	const starredItemDetails = starredItems.map(({itemId}) => itemsMap.get(itemId)!).filter(Boolean)

	const progress = 0
	const isExporting = false

	const handleExport = () => {}

	return html`
		<div class="export-container">
			<div class="panel items-panel">
				<h4>⭐ Starred Items</h4>
				<div class="list">
					${repeat(starredItemDetails, item => item.id, item => html`
						<button
							class="item-card"
							?data-selected=${item.id === selectedItemId.value}
							@click=${() => selectedItemId(item.id)}
						>
							<span class="label">${itemLabels[item.id] || `Item ${item.id}`}</span>
							<span class="kind">${Kind[item.kind]}</span>
						</button>
					`)}
					${starredItemDetails.length === 0 ? html`
						<p class="empty-state">No starred items. Star an item in the Outliner to export it.</p>
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
						<button class="export-button" @click=${handleExport} ?disabled=${selectedItemId.value === null}>
							${exportSvg}
							<span>Export "${itemLabels[selectedItemId.value!] || `Item ${selectedItemId.value!}`}"</span>
						</button>
					`}
				</div>
			</div>
		</div>
	`
})

