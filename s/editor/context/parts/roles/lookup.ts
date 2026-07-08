
import {GMap} from "@e280/stz"
import {Id, Kind} from "@omnimedia/omnitool"

import {Role, RoleScope} from "../state.js"
import {defaultRoleKeyFor} from "./utils.js"

const scopeOrder: Record<RoleScope, number> = {
	video: 0,
	text: 1,
	audio: 2,
	global: 3,
}

export class RoleLookup {
	#byId = new GMap<Id, Role>()
	#byKey = new GMap<string, Role>()
	#order = new GMap<Id, number>()

	constructor(public roles: readonly Role[]) {
		this.#byId.setEntries(roles.map(role => [role.id, role]))
		this.#byKey.setEntries(roles.map(role => [role.key, role]))
		this.#order.setEntries(roles.map((role, index) => [role.id, index]))
	}

	get(id: Id | null | undefined) {
		return id == null ? undefined : this.#byId.get(id)
	}

	require(id: Id) {
		return this.#byId.need(id)
	}

	key(key: string) {
		return this.#byKey.get(key)
	}

	requireKey(key: string) {
		return this.#byKey.need(key)
	}

	defaultFor(kind: Kind) {
		return this.requireKey(defaultRoleKeyFor(kind))
	}

	children(id: Id) {
		return this.roles.filter(role => role.parentRoleId === id)
	}

	siblings(id: Id) {
		const target = this.get(id)
		return target
			? this.roles.filter(role =>
				role.id !== target.id &&
				role.scope === target.scope &&
				role.parentRoleId === target.parentRoleId
			)
			: []
	}

	top(scope: RoleScope) {
		return this.roles.filter(role => role.scope === scope && !role.parentRoleId)
	}

	familyIds(id: Id) {
		return [
			id,
			...this.children(id).map(role => role.id),
		]
	}

	enabled(id: Id) {
		const role = this.get(id)
		const parent = this.get(role?.parentRoleId)
		return role?.enabled !== false && parent?.enabled !== false
	}

	orderOf(id: Id) {
		return this.#order.need(id)
	}

	laneRank(id: Id | null) {
		const role = this.get(id)
		return role
			? scopeOrder[role.scope] * 1000 + this.orderOf(role.id)
			: Infinity
	}
}

