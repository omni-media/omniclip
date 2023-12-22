export type MediaType = "Audio" | "Video" | "Image"

export interface Media {
	type: MediaType
	uri: string
}
