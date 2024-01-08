export function get_pixels_by_angle(x: number, y: number, width: number, height: number, angle: number) {
	// var radians1 = angle * Math.PI / 180;
	const radians = angle
	return [
		//upper left
		[x + width/2 + width/-2 * Math.cos(radians) - height/-2 * Math.sin(radians), y + height/2 + width/-2 * Math.sin(radians) + height/-2 * Math.cos(radians)],
		//upper right
		[x + width/2 + width/2 * Math.cos(radians) - height/-2 * Math.sin(radians), y + height/2 + width/2 * Math.sin(radians) + height/-2 * Math.cos(radians)],
		//bottom right
		[x + width/2 + width/2 * Math.cos(radians) - height/2 * Math.sin(radians), y + height/2 + width/2 * Math.sin(radians) + height/2 * Math.cos(radians)],
		//bottom left
		[x + width/2 + width/-2 * Math.cos(radians) - height/2 * Math.sin(radians), y + height/2 + width/-2 * Math.sin(radians) + height/2 * Math.cos(radians)],
	]
}

