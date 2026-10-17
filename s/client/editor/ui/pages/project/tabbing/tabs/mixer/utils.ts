
export const minimumGainDb = -60
export const maximumGainDb = 12

export const dbFromGain = (gain: number) =>
	gain <= 0 ? "-∞" : `${(20 * Math.log10(gain)).toFixed(1)}`

export const sliderDbFromGain = (gain: number) => Math.max(
	minimumGainDb,
	Math.min(maximumGainDb, gain <= 0 ? minimumGainDb : 20 * Math.log10(gain))
)

export const gainFromDb = (db: number) => 10 ** (db / 20)

export const meterHeight = (peak: number) => Math.max(0, Math.min(100,
	(sliderDbFromGain(peak) - minimumGainDb) / (maximumGainDb - minimumGainDb) * 100
))

export const masterStrip = (gain: number, peak: number, count: number) => ({
	gain,
	count,
	id: null,
	name: "Master",
	disabled: false,
	color: "#d6b45e",
	level: meterHeight(peak)
})

