
export function drawMinorTick (
	ctx: CanvasRenderingContext2D,
	x: number,
	time: number,
	scaleMajor: number,
	timebase: number,
	pps: number
) {
	if (scaleMajor === 1000) {
		// Micro scale: handle frame-level division rendering
		const frameNum = Math.round(time / (1000 / timebase))
		if (frameNum % 10 === 0 && (pps * (10 / timebase)) > 10) {
			ctx.fillStyle = "#444"
			ctx.fillRect(x, 16, 1, 16)
		} else if ((pps / timebase) > 4) {
			ctx.fillStyle = "#333"
			ctx.fillRect(x, 24, 1, 8)
		}
	} else {
		// Macro scale: standard minor tick
		ctx.fillStyle = "#444"
		ctx.fillRect(x, 16, 1, 16)
	}
}

