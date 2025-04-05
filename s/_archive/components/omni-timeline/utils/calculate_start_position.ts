export function calculate_start_position(start_position: number, zoom: number) {
	return start_position * Math.pow(2, zoom)
}
