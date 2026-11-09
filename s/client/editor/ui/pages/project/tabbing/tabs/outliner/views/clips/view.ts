
import {html} from "lit"
import type {Id} from "@omnimedia/omnitool"
import {repeat} from "lit/directives/repeat.js"
import {shadow, useCss, useSignal} from "@e280/sly"

import styleCss from "./style.css.js"
import {matchingItems} from "./search.js"
import {renderItemRow} from "../../renderers/item-row.js"
import themeCss from "../../../../../../../../theme.css.js"
import {Idx} from "../../../../../../../logic/parts/index.js"
import {Rules} from "../../../../../../../../context/parts/rules/rules.js"
import type {EditorContext} from "../../../../../../../../context/context.js"

import "@awesome.me/webawesome/dist/components/tree/tree.js"
import "@awesome.me/webawesome/dist/components/tree-item/tree-item.js"

export const ClipsView = shadow((context: EditorContext) => {
	useCss(themeCss, styleCss)

	const searchTerm = useSignal("")
	const collapsed = useSignal<ReadonlySet<Id>>(new Set())

	const index = context.session.index
	const timeline = context.strata.timeline.state
	const tags = context.session.organization.tags(index)
	const selectedItemId = context.session.$selectedItem()

	const rules = new Rules(tags)

	const term = searchTerm().trim().toLowerCase()
	const visible = matchingItems(timeline.rootId, index, tags, term)
	const root = index.getItem<Idx.Struct>(timeline.rootId)
	const rootChildren = root.childrenIds.filter(id => visible.has(id))

	const toggleExpanded = (id: Id) => {
		const next = new Set(collapsed())
		if (next.has(id)) next.delete(id)
		else next.add(id)
		collapsed(next)
	}

	const setExpanded = (event: Event, id: Id, expanded: boolean) => {
		const alreadyExpanded = !collapsed().has(id)
		if (event.target !== event.currentTarget || term || alreadyExpanded === expanded) return
		toggleExpanded(id)
	}

	const renderItem = (id: Id): unknown => {
		const item = index.getItem(id)
		const isRoot = id === timeline.rootId
		const isStructure = Idx.isStruct(item)
		const children = isStructure ? item.childrenIds.filter(childId => visible.has(childId)) : []
		return html`
			<wa-tree-item
				data-id=${id}
				?data-root=${isRoot}
				.selected=${selectedItemId === id}
				.expanded=${!!term || !collapsed().has(id)}
				@wa-expand=${(event: Event) => setExpanded(event, id, true)}
				@wa-collapse=${(event: Event) => setExpanded(event, id, false)}
			>
				${renderItemRow({
					item,
					color: tags.color(id),
					durationMs: index.getItemDuration(id),
					acceptedKinds: isStructure ? rules.acceptedKinds(id) : undefined,
					onToggleExpand: children.length && !isRoot && !term ? () => toggleExpanded(id) : undefined,
				})}
				${isRoot ? "" : repeat(children, childId => childId, renderItem)}
			</wa-tree-item>
		`
	}

	const search = (event: Event) => {
		searchTerm((event.currentTarget as HTMLInputElement).value)
	}

	const select = (event: CustomEvent<{selection: HTMLElement[]}>) => {
		const id = event.detail.selection[0].dataset.id!
		context.session.$selectedItem(id)
		context.session.seekPlayhead(index.getItemLaneStart(id, context.session.$viewedItemId()))
	}

	return html`
		<div class="search-bar">
			<input type="text" placeholder="Search items..." .value=${searchTerm()} @input=${search}>
		</div>

		<div class="outliner-content">
			${visible.has(timeline.rootId) ? html`
				<wa-tree selection="single" @wa-selection-change=${select}>
					${renderItem(timeline.rootId)}
					${repeat(rootChildren, id => id, renderItem)}
				</wa-tree>
			` : html`<p class="placeholder">No matching items.</p>`}
		</div>
	`
})

