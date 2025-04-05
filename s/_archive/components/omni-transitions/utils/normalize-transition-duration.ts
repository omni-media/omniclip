export function normalizeTransitionDuration(sliderValue: number, timebaseFrame: number) {
	let normalized = Math.round(sliderValue / timebaseFrame) * timebaseFrame
	while ((normalized / 2) % timebaseFrame !== 0) {
		normalized += timebaseFrame
	}
	return normalized
}
