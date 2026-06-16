export const clamp = (value: number, min: number, max: number) =>
	Math.min(max, Math.max(min, value))
