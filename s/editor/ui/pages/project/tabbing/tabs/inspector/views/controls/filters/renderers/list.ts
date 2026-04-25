
import {html} from "lit"
import type {Item} from "@omnimedia/omnitool"

import {checkedOf, titleize, Filters} from "../utils.js"

export const renderFilterList = (props: {
	filters: Item.Filter[]
	selectedFilter: Item.Filter | null
	selectFilter: (filterId: number) => void
	removeFilter: (filterId: number) => void
	setEnabled: (filter: Item.Filter, enabled: boolean) => void
}) => html`
	<div class="section">
		<div class="section-label">Filters</div>

		${props.filters.length
			? html`
				<div class="filter-grid">
					${props.filters.map(filter => html`
						<button
							class="filter-card"
							?data-active=${props.selectedFilter?.id === filter.id}
							@click=${() => props.selectFilter(filter.id)}
						>
							<div class="filter-card-header">
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
										.checked=${filter.enabled}
										@change=${(event: Event) => props.setEnabled(filter, checkedOf(event))}
									>
										Enabled
									</wa-switch>
								</div>

								<button
									class="ghost-button"
									@click=${(event: Event) => {
										event.stopPropagation()
										props.removeFilter(filter.id)
									}}
								>
									Remove
								</button>
							</div>
						</button>
					`)}
				</div>
			`
			: html`<p class="empty-state">No filters attached.</p>`}
	</div>
`

