
import {html} from "lit"
import {repeat} from "lit/directives/repeat.js"
import {Item, Kind} from "@omnimedia/omnitool"
import {shadow, useCss, useSignal} from "@e280/sly"
import {ms} from "@omnimedia/omnitool/x/units/ms.js"

import styleCss from "./style.css.js"
import {when} from "lit/directives/when.js"
import themeCss from "../../../../../../theme.css.js"
import {EditorContext} from "../../../../../../context/context.js"
import {rolesModal} from "../../../../../logic/modals/roles/modal.js"
import {OutlinerItem} from "../../../../../../context/parts/state.js"
import {renderRoleRow as renderOutlinerRoleRow} from "./renderers/role-row.js"
import {renderItemRow as renderOutlinerItemRow} from "./renderers/item-row.js"
import {renderRoleSection as renderOutlinerRoleSection} from "./renderers/role-section.js"
import {childRoles, roleEnabled, roleFamilyIds, roleSections, topRoles} from "../../../../../logic/roles.js"

export const OutlinerTab = shadow((context: EditorContext) => {
	useCss(themeCss, styleCss)

	const searchTerm = useSignal("")
	const outliner = context.strata.outliner
	const items = context.strata.timeline.state.items
	const selectedRoleId = useSignal<number | null>(null)

	const handleItemClick = (id: number) => {
		context.session.$selectedItem.value = id
		context.session.setPlayhead(ms(context.session.index
			.getItemLaneStart(id, context.session.$viewedItemId.value)
		))
	}

	const toggleStar = (id: number) => {
		outliner.mutate(state => {
			const item = state.items.find(({itemId}) => itemId === id)
			item!.starred = !item!.starred
		})
	}

	const itemEnabled = (item: OutlinerItem) =>
		roleEnabled(outliner.state.roles, item.roleId)

	const toggleRole = (id: number) => {
		const familyIds = roleFamilyIds(outliner.state.roles, id)
		const enabled = !outliner.state.roles.find(role => role.id === id)!.enabled
		const metas = outliner.state.items.filter(item => familyIds.includes(item.roleId))

		outliner.mutate(state => {
			for (const item of state.roles.filter(role => role.id === id || role.parentRoleId === id))
				item.enabled = enabled
		})

		context.strata.timeline.mutate(state => {
			for (const meta of metas) {
				const item = state.items.find(item => item.id === meta.itemId)
				if (item)
					item.enabled = itemEnabled(meta)
			}
		})
	}

	const selectRole = (id: number) => {
		selectedRoleId.value = selectedRoleId.value === id ? null : id
		const ids = roleFamilyIds(outliner.state.roles, id)
		const item = outliner.state.items.find(item => ids.includes(item.roleId))
		if (item)
			handleItemClick(item.itemId)
	}

	const isStarred = (id: number) => outliner.state.items.find(({itemId}) => itemId === id)?.starred

	const itemMeta = (id: number) => outliner.state.items.find(item => item.itemId === id)
	const matchesRole = (meta?: OutlinerItem) =>
		selectedRoleId.value === null || !!meta && roleFamilyIds(outliner.state.roles, selectedRoleId.value!).includes(meta.roleId)

	const matchesSearch = (item: Item.Any) => {
		const term = searchTerm.value.trim().toLowerCase()
		if (!term)
			return true

		return `${Kind[item.kind] ?? item.kind} ${item.id}`.toLowerCase().includes(term)
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

	const renderRoleRow = (role: typeof outliner.state.roles[number]) => {
		const familyIds = roleFamilyIds(outliner.state.roles, role.id)
		const roleItems = outliner.state.items.filter(item => familyIds.includes(item.roleId))
		return renderOutlinerRoleRow({
			role,
			count: roleItems.length,
			selected: selectedRoleId.value === role.id,
			disabled: !roleEnabled(outliner.state.roles, role.id),
			subrole: !!role.parentRoleId,
			onSelect: role => selectRole(role.id),
			onToggle: role => toggleRole(role.id),
		})
	}

	const renderRoleSection = (section: typeof roleSections[number]) => {
		const roles = topRoles(outliner.state.roles, section.scope)
		return renderOutlinerRoleSection({
			section,
			roles,
			renderRole: role => html`
				${renderRoleRow(role)}
				${childRoles(outliner.state.roles, role.id).map(renderRoleRow)}
			`,
		})
	}

	const filteredItems = items.filter(item => matchesSearch(item))
		.filter(item => matchesRole(itemMeta(item.id)))

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
					${roleSections.map(renderRoleSection)}
					<div class="role-actions">
						<wa-button size="small" variant="neutral" @click=${() => context.modals.openModal(rolesModal())}>
							Edit Roles...
						</wa-button>
					</div>
				</div>

				<div id="tags-panel" class="tab-panel">
					<p class="placeholder">Tags and Markers functionality will be implemented here.</p>
				</div>
			</div>
		</div>
	`
})
