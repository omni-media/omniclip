// type for media that is either compressed or downscaled
export interface ProcessedFile {
	originalFileHash: string
	hash: string
	file: File
}
