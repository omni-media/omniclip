import {AnyEffect} from "../../../context/types.js"

export function calculate_effect_width(effect: AnyEffect, zoom: number) {
	return (effect.end - effect.start) * Math.pow(2, zoom) 
}
