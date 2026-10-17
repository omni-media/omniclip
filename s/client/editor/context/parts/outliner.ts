
import {TimelineFile} from "@omnimedia/omnitool"

import {State} from "./state.js"

export function syncOutliner(outliner: State["outliner"], timeline: TimelineFile) {
	const existing = new Map(outliner.items.map(item => [item.itemId, item]))

	outliner.items = timeline.items.map(item => {
		const meta = existing.get(item.id)
		if (meta)
			return meta

		return {
			itemId: item.id,
			starred: false,
			tagIds: []
		}
	})
}

