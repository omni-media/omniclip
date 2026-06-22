
import {html} from "lit"
import {deep} from "@e280/stz"
import {shadow, useCss, useSignal} from "@e280/sly"
import {FilterableItem, Item, Kind, filters} from "@omnimedia/omnitool"

import styleCss from "./style.css.js"
import {controlsStyles} from "../styles.css.js"
import {FilterKey, Path, Schema} from "./utils.js"
import {renderFilterList} from "./renderers/list.js"
import {renderFilterToolbar} from "./renderers/toolbar.js"
import {renderFilterAdjustments} from "./renderers/adjustments.js"
import {EditorContext} from "../../../../../../../../../context/context.js"
import {add, remove, update} from "../../../../../../../../logic/parts/mutate.js"

import "@awesome.me/webawesome/dist/components/input/input.js"
import "@awesome.me/webawesome/dist/components/button/button.js"
import "@awesome.me/webawesome/dist/components/option/option.js"
import "@awesome.me/webawesome/dist/components/select/select.js"
import "@awesome.me/webawesome/dist/components/slider/slider.js"
import "@awesome.me/webawesome/dist/components/switch/switch.js"
import "@awesome.me/webawesome/dist/components/details/details.js"
import "@awesome.me/webawesome/dist/components/number-input/number-input.js"

export const FiltersControls = shadow((context: EditorContext, item: FilterableItem) => {
	useCss(controlsStyles, styleCss)

	const index = context.session.index

	const attachedFilters = (item.filterIds ?? [])
		.map(id => index.items.get(id))
		.filter((e): e is Item.Filter => !!e)

	const selectedFilterId = useSignal<number | null>(attachedFilters[0]?.id ?? null)

	const selectedFilter =
		attachedFilters.find(f => f.id === selectedFilterId.value)
		?? attachedFilters[0]
		?? null

	const selectFilter = (id: number) => selectedFilterId.value = id

	const setFilterParams = (filter: Item.Filter, path: Path, value: any) => {
		const next = deep.clone(filter.params ?? Schema.meta(filter).defaultParams)
		let cursor: any = next

		for (let i = 0; i < path.length - 1; i++)
			cursor = cursor[path[i]]

		cursor[path[path.length - 1]] = value

		context.strata.timeline.mutate(state => {
			update(state, filter.id, {params: next})
		})
	}

	const addFilter = async (key: FilterKey) => {
		const def = filters[key]
		const filter: Item.Filter = {
			id: context.omni.getId(),
			kind: Kind.Filter,
			type: def.type,
			params: Schema.defaultParams(def.schema),
			enabled: true,
		}

		await context.strata.timeline.mutate(state => {
			add(state, filter)
			update(state, item.id, {
				filterIds: [...(item.filterIds ?? []), filter.id]
			})
		})

		selectedFilterId.value = filter.id
	}

	const removeFilter = async (filterId: number) => {
		const remaining = attachedFilters.filter(f => f.id !== filterId)

		await context.strata.timeline.mutate(state => {
			update(state, item.id, {
				filterIds: (item.filterIds ?? []).filter(id => id !== filterId)
			})
			remove(state, filterId)
		})

		if (selectedFilterId.value === filterId)
			selectedFilterId.value = remaining[0]?.id ?? null
	}

	const setEnabled = (filter: Item.Filter, enabled: boolean) => {
		context.strata.timeline.mutate(state => {
			update(state, filter.id, {enabled})
		})
	}

	return html`
		<wa-details open summary="FILTERS" icon-placement="start" class="effects-panel">
			<div class="controls-group section">
				${renderFilterToolbar(addFilter)}

				${renderFilterList({
					filters: attachedFilters,
					selectedFilter,
					selectFilter,
					removeFilter,
					setEnabled
				})}
			</div>

			<div class="controls-group section">
				<div class="section-label">Adjustments</div>

				${renderFilterAdjustments({
					filter: selectedFilter,
					setFilterParams
				})}
			</div>
		</wa-details>
	`
})

