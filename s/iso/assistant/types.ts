
import type {Id, TimelineFile} from "@omnimedia/omnitool"

export type AssistantContext = {
	timeline: TimelineFile
	timelineRevision: number
	playhead: number
	viewedItemId: Id
	selectedItemId: Id | null
}
