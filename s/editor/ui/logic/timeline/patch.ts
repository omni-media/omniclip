import type {TimelineFile} from "@omnimedia/omnitool"

import type {TimelinePatch} from "../../../../iso/timeline.js"
import {validateTimeline} from "./validate.js"

const itemIndex = (timeline: TimelineFile, id: string) => {
	const index = timeline.items.findIndex(item => item.id === id)
	if (index === -1)
		throw new Error(`Item does not exist: ${id}`)
	return index
}

export function applyTimelinePatch(source: TimelineFile, patch: TimelinePatch) {
	const timeline = structuredClone(source)

	for (const operation of patch.operations) {
		switch (operation.op) {
			case "add":
				if (!operation.item)
					throw new Error("add requires an item")
				timeline.items.push(operation.item)
				break

			case "replace": {
				if (!operation.item || !operation.itemId)
					throw new Error("replace requires an itemId and complete item")
				if (operation.item.id !== operation.itemId)
					throw new Error("A replacement must preserve the item ID")
				timeline.items[itemIndex(timeline, operation.itemId)] = operation.item
				break
			}

			case "remove": {
				if (!operation.itemId)
					throw new Error("remove requires an itemId")
				timeline.items.splice(itemIndex(timeline, operation.itemId), 1)
				break
			}

			case "set_root":
				if (!operation.itemId)
					throw new Error("set_root requires an itemId")
				timeline.rootId = operation.itemId
				break

			case "set_audio":
				if (operation.audio === undefined)
					throw new Error("set_audio requires audio settings or null")
				if (operation.audio === null)
					delete timeline.audio
				else
					timeline.audio = operation.audio
		}
	}

	validateTimeline(timeline)
	return timeline
}

