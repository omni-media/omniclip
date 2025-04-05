import {pad_to_2_digits} from "./pad_to_2_digits.js"

export function convert_ms_to_hmsms(milliseconds: number) {
	let seconds = Math.floor(milliseconds / 1000)
	let minutes = Math.floor(seconds / 60)
	let hours = Math.floor(minutes / 60)
	
	seconds = seconds % 60
	minutes = minutes % 60
	hours = hours % 24

	return `${pad_to_2_digits(hours)}:${pad_to_2_digits(minutes)}:${pad_to_2_digits(seconds)}:${pad_to_2_digits(Math.floor(milliseconds % 1000))}`
}
