export function formatCredits(credits: number) {
	if (credits > 0 && credits < 0.005) return "<0.01"
	return credits.toLocaleString(undefined, {maximumFractionDigits: 2})
}
