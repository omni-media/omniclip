export function fitCanvasText(ctx: CanvasRenderingContext2D, text: string, width: number) {
	if (ctx.measureText(text).width <= width)
		return text

	const ellipsis = "…"
	let end = text.length
	while (end > 0 && ctx.measureText(text.slice(0, end) + ellipsis).width > width)
		end -= 1
	return text.slice(0, end) + ellipsis
}
