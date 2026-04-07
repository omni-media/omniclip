
export type ExportCodec = "h264" | "vp9" | "vp8"
export type ExportBitrate = "high" | "medium" | "low"

export type ExportResult = {
	codec: ExportCodec
	bitrate: ExportBitrate
}

export const codecOptions = [
	{value: "h264", label: "H.264"},
	{value: "vp8", label: "VP8"},
	{value: "vp9", label: "VP9"},
] as const

export const qualityOptions = [
	{value: "high", label: "High (8 Mbps)"},
	{value: "medium", label: "Medium (4 Mbps)"},
	{value: "low", label: "Low (2 Mbps)"},
] as const

