
import type {TimelineFile} from "@omnimedia/omnitool"

import type {OutlinerState} from "./state.js"

export function syncOutliner(outliner: OutlinerState, timeline: TimelineFile) {
	const ids = new Set(timeline.items.map(item => item.id))
	outliner.tagAssignments = outliner.tagAssignments.filter(assignment => ids.has(assignment.itemId))
	outliner.ruleAssignments = outliner.ruleAssignments.filter(assignment => ids.has(assignment.itemId))
}

