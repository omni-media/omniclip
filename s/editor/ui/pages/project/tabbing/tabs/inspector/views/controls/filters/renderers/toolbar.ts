
import {html} from "lit"
import {FilterKey, valueOf, titleize, Filters} from "../utils.js"

export const renderFilterToolbar = (addFilter: (key: FilterKey) => void) => html`
	<div class="filter-toolbar">
		<label class="field">
			<span class="field-label">Add filter</span>

			<wa-select
				size="small"
				class="choice-select"
				@change=${(event: Event) => {
					const value = valueOf(event)

					if (value)
						addFilter(value);

					(event.target as any).value = ""
				}}
			>
				<wa-option value="">Choose filter</wa-option>

				${Filters.options.map(([key]) => html`
					<wa-option value=${key}>${titleize(key)}</wa-option>
				`)}
			</wa-select>
		</label>
	</div>
`

