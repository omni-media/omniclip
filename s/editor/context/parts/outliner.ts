
import {TimelineFile} from "@omnimedia/omnitool"

import {State} from "./state.js"
import {RoleLookup} from "./roles/lookup.js"
import {isRoleableKind, isRoleLane} from "./roles/utils.js"

export function syncOutliner(outliner: State["outliner"], timeline: TimelineFile) {
	const existing = new Map(outliner.items.map(item => [item.itemId, item]))
	const roles = new RoleLookup(outliner.roles)

	outliner.items = timeline.items.filter(item => !isRoleLane(item) && isRoleableKind(item.kind)).map(item => {
		const meta = existing.get(item.id)
		if (meta)
			return meta

		return {
			itemId: item.id,
			starred: false,
			tagIds: [],
			roleId: roles.defaultFor(item.kind).id
		}
	})
}

