
import type {Id, TimelineFile} from "@omnimedia/omnitool"

export type MediaInfo = {
	mediaHash: string
	filename: string
	type: string
	duration: number
}

export type AssistantContext = {
	projectId: string
	media: MediaInfo[]
	kinds: Record<string, number>
	timeline: TimelineFile
	timelineRevision: number
	playhead: number
	viewedItemId: Id
	selectedItemId: Id | null
}
