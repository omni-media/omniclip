export type V2 = [number, number]

export function coordinates_in_rect(
	coordinates: V2,
	rect: DOMRect,
): V2 | null {

	const [clientX, clientY] = coordinates
	const x = clientX - rect.left
	const y = clientY - rect.top

	const withinX = (x >= 0) && (x <= rect.width)
	const withinY = (y >= 0) && (y <= rect.height)
	const within = withinX && withinY

	return within
		? [x, y]
		: null
}
