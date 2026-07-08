
import {derived} from "@e280/strata"
import {Id, Item, Kind, TimelineFile} from "@omnimedia/omnitool"

import {add} from "../mutate.js"
import {OmniSession} from "../../session.js"
import {DropIntent} from "../interactions/drag/parts/intent.js"
import {RoleLookup} from "../../../../context/parts/roles/lookup.js"
import {isRoleableKind, isRoleLane, roleIdFromLaneLabel, roleLaneLabel, roleScopeFor} from "../../../../context/parts/roles/utils.js"

export class Roles {
	#lookup

	constructor(private session: OmniSession) {
		this.#lookup = derived(() =>
			new RoleLookup(this.session.deps.strata.outliner.state.roles)
		)
	}

	get lookup() {
		return this.#lookup()
	}

	placeDefault(item: Item.Any) {
		this.session.timeline.mutate(state =>
			this.#placeInRoleLane(state, item.id, this.#defaultRoleId(item.kind))
		)
	}

	assign(itemId: Id, roleId: Id) {
		this.#setMeta(itemId, roleId)

		this.session.timeline.mutate(state => {
			this.#setItemEnabled(state, itemId, roleId)
			const viewed = this.session.index.getItemMaybe(this.session.$viewedItemId.value)
			if (viewed?.kind === Kind.Stack)
				this.#placeInRoleLane(state, itemId, roleId)
		})
	}

	assignFromDrop(itemId: Id, intent: DropIntent) {
		const roleId = this.#roleIdFromIntent(intent)
		if (roleId === null)
			return

		this.#setMeta(itemId, roleId)
		this.session.timeline.mutate(state => this.#setItemEnabled(state, itemId, roleId))
	}

	canDrop(itemId: Id, intent: DropIntent) {
		const roleId = this.#roleIdFromIntent(intent)
		if (roleId === null)
			return true

		const item = this.session.index.getItemMaybe(itemId)
		const role = this.lookup.get(roleId)
		return !!item && !!role && role.scope === roleScopeFor(item.kind)
	}

	organizeLanes() {
		this.session.timeline.mutate(state => {
			const root = state.items.find(item => item.id === state.rootId)
			if (root?.kind !== Kind.Stack)
				return

			for (const id of [...root.childrenIds]) {
				const child = state.items.find(item => item.id === id)
				if (!child)
					continue

				if (isRoleLane(child)) {
					for (const childId of [...child.childrenIds]) {
						const item = state.items.find(item => item.id === childId)
						if (item && isRoleableKind(item.kind))
							this.#placeInRoleLane(state, childId, this.#roleIdFor(childId, item.kind))
					}
				}
				else if (isRoleableKind(child.kind)) {
					this.#placeInRoleLane(state, child.id, this.#roleIdFor(child.id, child.kind))
				}
			}

			this.#orderLanes(state, root)
		})
	}

	#roleIdFromIntent(intent: DropIntent) {
		const sequenceId = "sequenceId" in intent ? intent.sequenceId : null
		const sequence = sequenceId === null
			? null
			: this.session.index.getItemMaybe<Item.Sequence>(sequenceId)
		return roleIdFromLaneLabel(sequence?.label)
	}

	#setMeta(itemId: Id, roleId: Id) {
		this.session.deps.strata.outliner.mutate(state => {
			const meta = state.items.find(meta => meta.itemId === itemId)
			if (meta)
				meta.roleId = roleId
		})
	}

	#setItemEnabled(state: TimelineFile, itemId: Id, roleId: Id) {
		const item = state.items.find(item => item.id === itemId)
		if (item)
			item.enabled = this.lookup.enabled(roleId)
	}

	#defaultRoleId(kind: Kind) {
		return this.lookup.defaultFor(kind).id
	}

	#roleIdFor(itemId: Id, kind?: Kind) {
		const meta = this.session.deps.strata.outliner.state.items.find(meta => meta.itemId === itemId)
		if (meta)
			return meta.roleId

		const item = kind === undefined
			? this.session.index.getItemMaybe(itemId)
			: {kind}
		return this.#defaultRoleId(item?.kind ?? Kind.Gap)
	}

	#roleLane(state: TimelineFile, roleId: Id) {
		const label = roleLaneLabel(roleId)
		const lane = state.items.find((item): item is Item.Sequence =>
			item.kind === Kind.Sequence && item.label === label
		)
		if (lane)
			return lane

		const item: Item.Sequence = {
			id: this.session.deps.omnitool.getId(),
			kind: Kind.Sequence,
			label,
			childrenIds: [],
		}
		add(state, item)
		return item
	}

	#placeInRoleLane(state: TimelineFile, itemId: Id, roleId: Id) {
		const root = state.items.find(item => item.id === state.rootId)
		if (root?.kind !== Kind.Stack)
			return

		const lane = this.#roleLane(state, roleId)
		for (const item of state.items)
			if ("childrenIds" in item)
				item.childrenIds = item.childrenIds.filter(id => id !== itemId)

		lane.childrenIds.push(itemId)
		if (!root.childrenIds.includes(lane.id))
			root.childrenIds.push(lane.id)

		this.#pruneLanes(state, root)
		this.#orderLanes(state, root)
	}

	#pruneLanes(state: TimelineFile, root: Item.Stack) {
		const empty = new Set(state.items
			.filter((item): item is Item.Sequence => isRoleLane(item))
			.filter(item => item.childrenIds.length === 0)
			.map(item => item.id)
		)

		root.childrenIds = root.childrenIds.filter(id => !empty.has(id))
		state.items = state.items.filter(item => !empty.has(item.id))
	}

	#orderLanes(state: TimelineFile, root: Item.Stack) {
		const rank = (id: Id) => {
			const item = state.items.find(item => item.id === id)
			const roleId = item && isRoleLane(item)
				? roleIdFromLaneLabel(item.label)
				: null
			return this.lookup.laneRank(roleId)
		}

		root.childrenIds = [...root.childrenIds].sort((a, b) => rank(a) - rank(b))
	}
}

