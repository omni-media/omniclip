import {TimelineFile} from "@omnimedia/omnitool"

import {defaultRoleKeyFor, defaultRoles, State} from "./state.js"

export function syncOutliner(outliner: State["outliner"], timeline: TimelineFile) {
	const roleByKey = new Map(outliner.roles.map(role => [role.key, role]))
	outliner.roles = defaultRoles.map(role => roleByKey.get(role.key) ?? role)

	const roleId = (key: string) =>
		outliner.roles.find(role => role.key === key)!.id

	const existing = new Map(outliner.items.map(item => [item.itemId, item]))

	outliner.items = timeline.items.map(item => {
		const meta = existing.get(item.id)
		if (meta)
			return meta

		return {
			itemId: item.id,
			starred: false,
			tagIds: [],
			roleId: roleId(defaultRoleKeyFor(item.kind)),
		}
	})
}
