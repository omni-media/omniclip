
import {html} from "lit"
import type {Id, Item} from "@omnimedia/omnitool"

import {checkedOf, titleize, Filters} from "../utils.js"

import "@awesome.me/webawesome/dist/components/icon/icon.js"

export const renderFilterList = (props: {
	filters: Item.Filter[]
	selectedFilter: Item.Filter | null
	selectFilter: (filterId: Id) => void
	removeFilter: (filterId: Id) => void
	setEnabled: (filter: Item.Filter, enabled: boolean) => void
}) => html`
	<div class="section">
		<div class="section-label">Filters</div>

		${props.filters.length
			? html`
				<div class="filter-grid">
					${props.filters.map(filter => html`
						<div
							class="filter-card"
							?data-active=${props.selectedFilter?.id === filter.id}
							?data-selectable=${props.filters.length > 1}
							@click=${() => props.selectFilter(filter.id)}
						>
							<div
								class="filter-card-header"
							>
								<span class="filter-name">
									${titleize(Filters.keyFor(filter.type) ?? filter.type)}
								</span>

								<span class="filter-tag">
									${filter.enabled ? "On" : "Off"}
								</span>
							</div>

							<div class="filter-card-actions">
								<div class="toggle" @click=${(event: Event) => event.stopPropagation()}>
									<wa-switch
										size="small"
										aria-label=${`Toggle ${titleize(Filters.keyFor(filter.type) ?? filter.type)} filter`}
										.checked=${filter.enabled}
										@change=${(event: Event) => props.setEnabled(filter, checkedOf(event))}
									></wa-switch>
								</div>

								<button
									type="button"
									class="ghost-button"
									aria-label=${`Remove ${titleize(Filters.keyFor(filter.type) ?? filter.type)} filter`}
									title="Remove filter"
									@click=${(event: Event) => {
										event.stopPropagation()
										props.removeFilter(filter.id)
									}}
								>
									<wa-icon name="trash"></wa-icon>
								</button>
							</div>
						</div>
					`)}
				</div>
			`
			: html`<p class="empty-state">No filters attached.</p>`}
	</div>
`
