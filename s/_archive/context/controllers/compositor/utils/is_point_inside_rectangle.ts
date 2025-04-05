import {get_pixels_by_angle} from "./get_pixels_by_angle.js"

export function is_point_inside_rectangle(clickX: number, clickY: number, x: number, y: number, width: number, height: number, angle: number) {
	const corners = get_pixels_by_angle(x, y, width, height, angle);

	let inside = false;
	for (let i = 0, j = corners.length - 1; i < corners.length; j = i++) {
		const xi = corners[i][0], yi = corners[i][1]
		const xj = corners[j][0], yj = corners[j][1]

		const intersect = ((yi > clickY) !== (yj > clickY)) &&
				(clickX < (xj - xi) * (clickY - yi) / (yj - yi) + xi)
		if (intersect) inside = !inside
	}

	return inside
}
