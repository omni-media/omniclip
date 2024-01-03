import {AnyEffect} from "../../../context/controllers/timeline/types.js"

export function calculate_effect_width(effect: AnyEffect, zoom: number) {
	return (effect.end - effect.start) * Math.pow(2, zoom) 
}
