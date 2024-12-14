import {filters} from "fabric"
import {Op, html, css} from "@benev/slate"

import {styles} from "./styles.js"
import {Tooltip} from "../../views/tooltip/view.js"
import {shadow_component} from "../../context/context.js"
import {tooltipStyles} from "../../views/tooltip/styles.js"
import {StateHandler} from "../../views/state-handler/view.js"
import {ImageEffect, VideoEffect} from "../../context/types.js"
import circleInfoSvg from "../../icons/gravity-ui/circle-info.svg.js"
import overlapSvg from "../../icons/material-design-icons/overlap.svg.js"
import {FilterType} from "../../context/controllers/compositor/parts/filter-manager.js"

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
	const [filterPreviews, setFilterPreviews, getFilterPreviews] = use.state<{type: FilterType, canvas: HTMLCanvasElement}[]>([])

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
					<select
						@change=${(event: Event) => {
							const target = event.target as HTMLSelectElement
							const effectId = target.value
							const effect = use.context.state.effects.find(effect => effect.id === effectId)
							controllers.timeline.set_selected_effect(effect, use.context.state)
						}}
						id="clip"
						name="clip"
					>
						<option .selected=${!selectedImageOrVideoEffect} value=none>none</option>
						${imageAndVideoEffects().map(effect => html`<option .selected=${selectedImageOrVideoEffect?.id === effect.id} value=${effect.id}>${effect.name}</option>`)}
					</select>
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

	const renderFilters = () => {
		return filterPreviews.map(({type, canvas}) => {
			const filter = new filters[type]()
			const hasNumberParameter = typeof filter.getMainParameter() === "number"
			return html`
			<div>
				<div
					class="filter"
					?data-selected=${filtersManager.selectedFilterForEffect(selectedImageOrVideoEffect!, type)}
					@pointerdown=${(e: PointerEvent) => {
						e.preventDefault()
						filtersManager.addFilterToEffect(selectedImageOrVideoEffect!, type)
					}}
				>
					${canvas}
					<p>${type}</p>
				</div>
				${hasNumberParameter
					? html`
						<div class=filter-intensity>
							<span>Intensity</span>
							<input
								@change=${(v: InputEvent) => filtersManager.updateEffectFilter(selectedImageOrVideoEffect!, type, +(v.target as HTMLInputElement).value)}
								type="range" min="-1" max="1" value="0.75" step="0.01" class="slider" id="myRange"
							>
						</div>
					`
					: null
				}
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
