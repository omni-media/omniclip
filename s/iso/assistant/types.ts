
import type {TimelineFile} from "@omnimedia/omnitool"

export type AssistantContext = {
	timeline: TimelineFile
	playhead: number
	viewedItemId: number
	selectedItemId: number | null
}
