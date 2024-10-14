import {pub} from "@benev/slate"
import {FabricImage, filters} from "fabric"

import {Compositor} from "../controller.js"
import {AnyEffect, ImageEffect, State, VideoEffect} from "../../../types.js"

export const IgnoredFilters = ["BaseFilter", "Resize", "RemoveColor", "Gamma", "Convolute", "ColorMatrix", "BlendImage", "BlendColor", "Composed"]
export type FilterType = keyof Omit<typeof filters, "BaseFilter" | "Resize" | "RemoveColor" | "Gamma" | "Convolute" | "ColorMatrix" | "BlendImage" | "BlendColor" | "Composed">
export type Filter = {
	targetEffectId: string
	type: FilterType
}

export class FiltersManager {
	#filters: Filter[] = []
	onChange = pub()

	constructor(private compositor: Compositor) {}

	selectedFilterForEffect(effect: AnyEffect | null, filterType: FilterType) {
		if(!effect) return
		const haveFilter = this.#filters.find(f => f.targetEffectId === effect.id && filterType === f.type)
		if(haveFilter) {
			return true
		} else return false
	}

	#getObject(effect: VideoEffect | ImageEffect) {
		const videoObject = this.compositor.managers.videoManager.get(effect.id)
		const imageObject = this.compositor.managers.imageManager.get(effect.id)
		if(videoObject) {
			return videoObject
		} else if(imageObject) {
			return imageObject
		}
	}

	addFilterToEffect(
		effect: ImageEffect | VideoEffect,
		type: FilterType,
	) {
		const filter = new filters[type]()
		const object = this.#getObject(effect)!
		const alreadyHasThisFilter = object.filters.find(filter => filter.type === type)
		if(alreadyHasThisFilter) {
			this.removeFilterFromEffect(effect, type)
		} else {
			//@ts-ignore
			object.filters.push(filter)
			object.applyFilters()
			this.#filters.push({targetEffectId: effect.id, type})
			this.compositor.canvas.renderAll()
		}
		this.onChange.publish(true)
	}

	removeFilterFromEffect(effect: ImageEffect | VideoEffect, type: FilterType) {
		const object = this.#getObject(effect)!
		this.#filters = this.#filters.filter(filter => !(filter.targetEffectId === effect.id && filter.type === type))
		object.filters = object.filters.filter(filter => filter.type !== type)
		object.applyFilters()
		this.onChange.publish(true)
		this.compositor.canvas.renderAll()
	}

	updateEffectFilter(effect: ImageEffect | VideoEffect, filterName: FilterType, value: number) {
		const object = this.#getObject(effect)!
		const filter = object.filters.find(filter => filter.type === filterName)
		if(filter) {
			filter.setMainParameter(value)
			object.applyFilters()
			this.compositor.canvas.renderAll()
		}
	}

	removeAllAnimationsFromEffect(effect: ImageEffect | VideoEffect, state: State) {
		this.onChange.publish(true)
	}

	onseek(effect: VideoEffect | ImageEffect) {
		const object = this.#getObject(effect)! as FabricImage
		if(object.filters.length > 0) {
			object.removeTexture(object.cacheKey)
			object.removeTexture(object.cacheKey + "_filtered")
			object.applyFilters()
		}
	}
}
