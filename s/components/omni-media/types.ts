export type MediaType = "Audio" | "Video" | "Image"

export interface Media {
	type: MediaType
	source: string
}
