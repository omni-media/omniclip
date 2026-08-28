
import {html} from "lit"
import {repeat} from "lit/directives/repeat.js"
import {Item, Kind} from "@omnimedia/omnitool"
import {shadow, useCss, useSignal} from "@e280/sly"
import {ms} from "@omnimedia/omnitool/x/units/ms.js"

import styleCss from "./style.css.js"
import {when} from "lit/directives/when.js"
import themeCss from "../../../../../../theme.css.js"
import {EditorContext} from "../../../../../../context/context.js"
import {renderItemRow as renderOutlinerItemRow} from "./renderers/item-row.js"
import {itemLabel} from "../../../../../logic/utils/item-label.js"

export const OutlinerTab = shadow((context: EditorContext) => {
	useCss(themeCss, styleCss)

	const searchTerm = useSignal("")
	const outliner = context.strata.outliner
	const items = context.strata.timeline.state.items

	const handleItemClick = (id: number) => {
		context.session.$selectedItem.value = id
		context.session.seekPlayhead(ms(context.session.index
			.getItemLaneStart(id, context.session.$viewedItemId.value)
		))
	}

	const toggleStar = (id: number) => {
		outliner.mutate(state => {
			const item = state.items.find(({itemId}) => itemId === id)
			item!.starred = !item!.starred
		})
	}

	const isStarred = (id: number) => outliner.state.items.find(({itemId}) => itemId === id)?.starred

	const matchesSearch = (item: Item.Any) => {
		const term = searchTerm.value.trim().toLowerCase()
		if (!term)
			return true

		return `${itemLabel(item)} ${Kind[item.kind] ?? item.kind} ${item.id}`
			.toLowerCase()
			.includes(term)
	}

	const renderItemRow = (item: Item.Any) => {
		return renderOutlinerItemRow({
			item,
			selected: context.session.$selectedItem.value === item.id,
			starred: !!isStarred(item.id),
			onSelect: handleItemClick,
			onToggleStar: toggleStar,
		})
	}

	const filteredItems = items.filter(item => matchesSearch(item))

	const starredItemsFiltered = filteredItems.filter(i => isStarred(i.id))
	const otherItemsFiltered = filteredItems.filter(i => !isStarred(i.id))

	return html`
		<div class="outliner-tabs">
			<input type="radio" name="outliner-tab" id="tab-clips" checked />
			<input type="radio" name="outliner-tab" id="tab-tags" />

			<nav class="tab-bar">
				<label for="tab-clips">Clips</label>
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

				<div id="tags-panel" class="tab-panel">
					<p class="placeholder">Tags and Markers functionality will be implemented here.</p>
				</div>
			</div>
		</div>
	`
})
