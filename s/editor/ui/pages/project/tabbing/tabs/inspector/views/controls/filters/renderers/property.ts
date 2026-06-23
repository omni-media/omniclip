
import {html, type TemplateResult} from 'lit'
import type {FilterPropertyConfig, Item} from '@omnimedia/omnitool'

import {checkedOf, titleize, valueOf, Path} from '../utils.js'

const paramRow = (label: string, content: TemplateResult) => html`
	<div class="param-row">
		<div class="param-header">
			<span class="param-name">${label}</span>
		</div>
		${content}
	</div>
`

export const createPropertyRenderer = (
	filter: Item.Filter,
	setFilterParams: (filter: Item.Filter, path: Path, value: any) => void
) => {
	const render = (
		name: string,
		config: FilterPropertyConfig,
		path: Path,
		value: any
	): TemplateResult => {
		const label = titleize(name)
		const set = (next: any) => setFilterParams(filter, path, next)
		const val = value ?? ('default' in config ? config.default : undefined)

		switch (config.type) {
			case 'number':
				return paramRow(label, html`
					<div class="range-row">
						<wa-slider
							size="small"
							min=${config.min}
							max=${config.max}
							step=${config.step ?? 0.01}
							.value=${Number(val)}
							@input=${(e: Event) => set(Number(valueOf(e)))}
						></wa-slider>

						<wa-number-input
							class="number-input"
							size="small"
							without-steppers
							min=${config.min}
							max=${config.max}
							step=${config.step ?? 0.01}
							.value=${String(val)}
							@input=${(e: Event) => set(Number(valueOf(e)))}
						></wa-number-input>
					</div>
				`)

			case 'boolean':
				return html`
					<div class="param-row">
						<div class="boolean-row">
							<wa-switch
								size="small"
								.checked=${Boolean(val)}
								@change=${(e: Event) => set(checkedOf(e))}
							>
								${label}
							</wa-switch>
						</div>
					</div>
				`

			case 'color':
				return paramRow(label, html`
					<div class="color-row">
						<wa-color-picker
							class="color-input"
							size="small"
							format="hex"
							without-format-toggle
							.value=${String(val)}
							@input=${(e: Event) => set(valueOf(e))}
						></wa-color-picker>

						<wa-input
							size="small"
							class="text-input"
							.value=${String(val)}
							@input=${(e: Event) => set(valueOf(e))}
						></wa-input>
					</div>
				`)

			case 'choice': {
				const options = Array.isArray(config.options)
					? config.options.map(o => [o, o])
					: Object.entries(config.options)

				return paramRow(label, html`
					<div class="choice-row">
						<wa-select
							size="small"
							class="choice-select"
							.value=${String(val)}
							@change=${(e: Event) => {
								const raw = valueOf(e)
								const next = options.find(([o]) => String(o) === raw)?.[0] ?? raw
								set(next)
							}}
						>
							${options.map(([o, l]) => html`
								<wa-option value=${String(o)}>${String(l)}</wa-option>
							`)}
						</wa-select>
					</div>
				`)
			}

			case 'object':
				return html`
					<div class="nested-group">
						<div class="group-title">${label}</div>

						${Object.entries(config.properties).map(([k, c]) =>
							render(k, c, [...path, k], (value ?? {})[k])
						)}
					</div>
				`

			case 'array':
				return html`
					<div class="nested-group">
						<div class="group-title">${label}</div>

						${config.items.map((c, i) =>
							render(`${label} ${i + 1}`, c, [...path, i], (value ?? [])[i])
						)}
					</div>
				`
		}
	}

	return render
}

