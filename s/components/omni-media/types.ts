export type MediaType = "Audio" | "Video" | "Image"

export interface MediaFile {
	hash: string
	file: File
}

export type AnyMedia = Video | Audio

export interface VideoFile extends MediaFile {
	kind: "video"
}

export interface AudioFile extends MediaFile {
	kind: "audio"
}

export interface Video extends MediaFile {
	kind: "video"
	element: HTMLVideoElement
	thumbnail: string
}

export interface Audio extends MediaFile {
	kind: "audio"
	element: HTMLAudioElement
}
