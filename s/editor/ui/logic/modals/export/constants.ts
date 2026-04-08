
export type ExportCodec = "h264" | "vp9" | "vp8" | "hevc"
export type ExportBitrate = "high" | "medium" | "low" | "custom"

export type ExportResult = {
	codec: ExportCodec
	bitrate: number
	format: ExportFormat
}

export type ExportFormat = "mp4" | "mov" | "webm"

export const codecOptions = [
	{value: "h264", label: "H.264"},
	{value: "hevc", label: "H.265"},
	{value: "vp8", label: "VP8"},
	{value: "vp9", label: "VP9"},
] as const

export const qualityOptions = [
	{value: "high", label: "High", kbps: 8000},
	{value: "medium", label: "Medium", kbps: 4000},
	{value: "low", label: "Low", kbps: 2000},
	{value: "custom", label: "Custom", kbps: 5000},
] as const

export const getQualityLabel = (opt: typeof qualityOptions[number]) =>
	opt.value === "custom" ? opt.label : `${opt.label} (${opt.kbps / 1000} Mbps)`

export const codecSupportedFormats: Record<ExportCodec, ExportFormat[]> = {
	h264: ["mp4", "mov"],
	hevc: ["mp4", "mov"],
	vp9:  ["webm"],
	vp8: ["webm"]
}
