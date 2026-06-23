import {html} from "lit"
import {shadow, useCss, useSignal} from "@e280/sly"
import {Item, Kind} from "@omnimedia/omnitool"
import {repeat} from "lit/directives/repeat.js"

import styleCss from "./style.css.js"
import {when} from "lit/directives/when.js"
import themeCss from "../../../../../../theme.css.js"
import textSvg from "../../../../../icons/gravity-ui/text.svg.js"
import starSvg from "../../../../../icons/gravity-ui/star.svg.js"
import {EditorContext} from "../../../../../../context/context.js"
import stackSvg from "../../../../../icons/gravity-ui/bars.svg.js"
import sequenceSvg from "../../../../../icons/gravity-ui/timeline.svg.js"
import starFillSvg from "../../../../../icons/gravity-ui/star-fill.svg.js"
import videoPlayerSvg from "../../../../../icons/carbon-icons/video-player.svg.js"

export const OutlinerTab = shadow((context: EditorContext) => {
	useCss(themeCss, styleCss)

	const items = context.strata.timeline.state.items
	const outliner = context.strata.outliner
	const searchTerm = useSignal("")

	const handleItemClick = (id: number) => {
		// context.controllers.navigation.stepTo(id)
		console.log(`Maps to edit item: ${id}`)
	}

	const toggleStar = (id: number) => {
		outliner.mutate(state => {
			const item = state.items.find(({itemId}) => itemId === id)
			item!.starred = !item!.starred
		})
	}

	const renderIcon = (kind: Kind) => {
		switch (kind) {
			case Kind.Stack: return stackSvg;
			case Kind.Sequence: return sequenceSvg;
			case Kind.Video: return videoPlayerSvg;
			case Kind.Text: return textSvg;
			default: return html`?`;
		}
	}

	const isStarred = (id: number) => outliner.state.items.find(({itemId}) => itemId === id)?.starred

	const renderItemRow = (item: Item.Any) => {
		const duration = (item as any).duration ? `${((item as any).duration / 1000).toFixed(2)}s` : "—"
		const starred = isStarred(item.id)
		return html`
			<div class="item-row" @click=${() => handleItemClick(item.id)}>
				<span class="color-swatch"></span>
				<span class="icon">${renderIcon(item.kind)}</span>
				<span class="label">${Kind[item.kind] ?? item.kind} ${item.id}</span>
				<span class="duration">${duration}</span>
				<button class="star-button" ?data-starred=${starred} @click=${(e: Event) => {e.stopPropagation(); toggleStar(item.id)}}>
					${starred ? starFillSvg : starSvg}
				</button>
			</div>
		`
	}

	const filteredItems = items
	const starredItemsFiltered = filteredItems.filter(i => isStarred(i.id))
	const otherItemsFiltered = filteredItems.filter(i => !isStarred(i.id))

	return html`
		<div class="outliner-tabs">
			<input type="radio" name="outliner-tab" id="tab-clips" checked />
			<input type="radio" name="outliner-tab" id="tab-roles" />
			<input type="radio" name="outliner-tab" id="tab-tags" />

			<nav class="tab-bar">
				<label for="tab-clips">Clips</label>
				<label for="tab-roles">Roles</label>
				<label for="tab-tags">Tags</label>
			</nav>

			<div class="search-bar">
				<input type="text" placeholder="Search items..." .value=${searchTerm.value} @input=${(e: any) => searchTerm(e.target.value)}>
			</div>

			<div class="tab-panels">
				<div id="clips-panel" class="tab-panel">
					${when(starredItemsFiltered.length > 0, () => html`
						<div class="section">
							<h4 class="section-title">Starred Items</h4>
							<div class="item-list-header">
								<span>Name</span>
								<span>Duration</span>
							</div>
							<div class="item-list">
								${repeat(starredItemsFiltered as Item.Any[], item => item.id, renderItemRow)}
							</div>
						</div>
					`)}

					<div class="section">
						<h4 class="section-title">All Items</h4>
						<div class="item-list-header">
								<span>Name</span>
								<span>Duration</span>
							</div>
						<div class="item-list">
							${repeat(otherItemsFiltered as Item.Any[], item => item.id, renderItemRow)}
						</div>
					</div>
				</div>

				<div id="roles-panel" class="tab-panel">
					<p class="placeholder">Roles functionality will be implemented here.</p>
				</div>

				<div id="tags-panel" class="tab-panel">
					<p class="placeholder">Tags and Markers functionality will be implemented here.</p>
				</div>
			</div>
		</div>
	`
})
