
import {html} from "lit"
import type {Item} from "@omnimedia/omnitool"

import {createPropertyRenderer} from "./property.js"
import {Path, Schema, titleize} from "../utils.js"

export const renderFilterAdjustments = (props: {
	filter: Item.Filter | null
	setFilterParams: (filter: Item.Filter, path: Path, value: any) => void
}) => {
	const {key, def, schemaEntries, defaultParams} = Schema.meta(props.filter)

	if (!props.filter || !def)
		return html`<p class="empty-state">Select a filter to edit its parameters.</p>`

	const renderProperty = createPropertyRenderer(
		props.filter,
		props.setFilterParams
	)

	return html`
		<div class="group-title">${titleize(key ?? props.filter.type)}</div>

		${schemaEntries.length
			? html`
				<div class="param-grid">
					${schemaEntries.map(([name, config]) =>
						renderProperty(
							name,
							config,
							[name],
							(props.filter!.params ?? defaultParams)[name as keyof typeof props.filter.params],
						)
					)}
				</div>
			`
			: html`<p class="empty-state">This filter has no exposed parameters.</p>`}
	`
}

