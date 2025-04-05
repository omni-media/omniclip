import {Op, html, css, TemplateResult} from "@benev/slate"

import {styles} from "./styles.js"
import {Tooltip} from "../../views/tooltip/view.js"
import {shadow_component} from "../../context/context.js"
import {tooltipStyles} from "../../views/tooltip/styles.js"
import {StateHandler} from "../../views/state-handler/view.js"
import {ImageEffect, VideoEffect} from "../../context/types.js"
import circleInfoSvg from "../../icons/gravity-ui/circle-info.svg.js"
import overlapSvg from "../../icons/material-design-icons/overlap.svg.js"
import {FilterPropertyConfig, FilterSchemas, FilterType} from "../../context/controllers/compositor/parts/filter-manager.js"

export const OmniFilters = shadow_component(use => {
	use.watch(() => use.context.state)
	use.styles([styles, tooltipStyles, css`
		#icon-container {
			position: relative;
			top: -25px;
		}
	`])

	const controllers = use.context.controllers
	const filtersManager = controllers.compositor.managers.filtersManager
	const [filterPreviews, setFilterPreviews, getFilterPreviews] = use.state<{type: FilterType, canvas: PIXI.ICanvas, uid: number}[]>([])

	const selectedImageOrVideoEffect = use.context.state.selected_effect?.kind === "video" || use.context.state.selected_effect?.kind === "image"
		? use.context.state.effects.find(effect => effect.id === use.context.state.selected_effect!.id)! as ImageEffect | VideoEffect
		: null

	use.mount(() => {
		filtersManager.createFilterPreviews((preview) => setFilterPreviews([...getFilterPreviews(), preview]))
		const dispose = filtersManager.onChange(() => use.rerender())
		return () => dispose()
	})

	const imageAndVideoEffects = () => use.context.state.effects.filter(effect => effect.kind === "image" || effect.kind === "video") as VideoEffect[] | ImageEffect[]
	const renderEffectSelectionDropdown = () => {
		return html`
			<div class=dropdown>
				<div class=flex>
					<sl-select
						value=${selectedImageOrVideoEffect?.id ?? "none"}
						@sl-change=${(event: Event) => {
							const target = event.target as HTMLSelectElement
							const effectId = target.value
							const effect = use.context.state.effects.find(effect => effect.id === effectId)
							controllers.timeline.set_selected_effect(effect, use.context.state)
						}}
						id="clip"
						name="clip"
					>
						<sl-option .selected=${!selectedImageOrVideoEffect} value=none>none</sl-option>
						${imageAndVideoEffects().map(effect => html`<sl-option .selected=${selectedImageOrVideoEffect?.id === effect.id} value=${effect.id}>${effect.name}</sl-option>`)}
					</sl-select>
					${renderDropdownInfo()}
				</div>
			</div>
		`
	}

	const renderDropdownInfo = () => {
		return Tooltip(
			circleInfoSvg,
			html`<p>Select video or image either from dropdown menu here, timeline or scene</p>`
		)
	}

	const renderControl = (
		filterType: FilterType,
		propertyPath: string[],
		config: FilterPropertyConfig
	): TemplateResult => {
		const label = propertyPath.join(".");
		switch (config.type) {
			case "number":
				return html`
					<sl-range
						label=${label}
						@sl-change=${(e: InputEvent) =>
							filtersManager.updateEffectFilter(
								selectedImageOrVideoEffect!,
								filterType,
								propertyPath,
								+(e.target as HTMLInputElement).value
							)}
						type="range"
						min="${config.min}"
						max="${config.max}"
						value="${config.default}"
						step="0.1"
					>
					</sl-range>
				`
			case "color":
				return html`
					<label>
						${label}:
						<input
							@change=${(e: InputEvent) =>
								filtersManager.updateEffectFilter(
									selectedImageOrVideoEffect!,
									filterType,
									propertyPath,
									(e.target as HTMLInputElement).value
								)}
							type="color"
							value="${config.default}"
						>
					</label>
				`
			case "boolean":
				return html`
					<label>
						${label}:
						<input
							@change=${(e: InputEvent) =>
								filtersManager.updateEffectFilter(
									selectedImageOrVideoEffect!,
									filterType,
									propertyPath,
									(e.target as HTMLInputElement).checked ? 1 : 0
								)}
							type="checkbox"
							?checked="${config.default}"
						>
					</label>
				`
			case "choice":
				// Normalize options: if it's an array, map each string to { value, label }
				// if it's an object, use Object.entries.
				const normalizedOptions = Array.isArray(config.options)
					? config.options.map(option => ({ value: option, label: option }))
					: Object.entries(config.options).map(
							([value, label]) => ({ value, label })
						)
				return html`
					<sl-select
						hoist
						size="small"
						label=${label}
						@sl-change=${(e: InputEvent) =>
							filtersManager.updateEffectFilter(
								selectedImageOrVideoEffect!,
								filterType,
								propertyPath,
								+(e.target as HTMLSelectElement).value
							)}
					>
						${normalizedOptions.map(
							({ value, label }) => html`
								<sl-option value="${value}" ?selected="${value === config.default}">
									${label}
								</sl-option>
							`
						)}
					</sl-select>
				`
			case "object":
				// For an object type, recursively render nested controls.
				return html`
					<fieldset>
						<legend>${label}</legend>
						${Object.entries(config.properties).map(([subProp, subConfig]) =>
							renderControl(filterType, [...propertyPath, subProp], subConfig)
						)}
					</fieldset>
				`
			case "array":
				return html`
					<fieldset>
						${config.items.map((_, i) => {
							return html`
								<legend>${label}</legend>
								${renderControl(filterType, [...propertyPath, `${i}`], config.items[0])}
								<!-- Optionally, add UI controls to add or remove items -->
							`})}
					</fieldset>
				`
			default:
				return html``
		}
	}

	const renderFilterOptions = (type: FilterType): TemplateResult => {
		const { ...params } = FilterSchemas[type] as typeof FilterSchemas[typeof type]
		return html`
			${Object.entries(params).map(([propertyName, config]) =>
				renderControl(type, [propertyName], config)
			)}
		`
	}

	const renderFilters = () => {
		return filterPreviews.map(({type, canvas}) => {
			return html`
			<div class=filter>
				<div
					class="filter-preview"
					?data-selected=${filtersManager.selectedFilterForEffect(selectedImageOrVideoEffect!, type)}
					@pointerdown=${(e: PointerEvent) => {
						e.preventDefault()
						filtersManager.addFilterToEffect(selectedImageOrVideoEffect!, type)
					}}
				>
					<p>${type}</p>
				</div>
				<sl-dropdown hoist>
					<sl-button slot="trigger" size="small" caret>Options</sl-button>
					<sl-menu class=options>
						${renderFilterOptions(type)}
					</sl-menu>
				</sl-dropdown>
			</div>
		`})
	}

	return StateHandler(Op.all(
		use.context.is_webcodecs_supported.value,
		use.context.helpers.ffmpeg.is_loading.value), () =>  html`
		<div class=box>
			<h2>${overlapSvg} Filters</h2>
			${renderEffectSelectionDropdown()}
			<div class="filters" ?disabled=${!selectedImageOrVideoEffect}>
				${renderFilters()}
			</div>
		</div>
	`)
})
