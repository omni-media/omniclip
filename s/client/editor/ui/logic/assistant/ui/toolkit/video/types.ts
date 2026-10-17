
export type TimelineAnalysis = {
	itemId: string
	mediaHash: string
	start: number
	end: number
	analysis: string
}

export type TimelineVideo = {
	itemId: string
	mediaHash: string
	source: Blob
}

export type MediaPart = {
	blob: Blob
	start: number
	end: number
}
