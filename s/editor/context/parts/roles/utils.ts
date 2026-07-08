
import {Id, Item, Kind} from "@omnimedia/omnitool"

import {RoleScope} from "../state.js"

export const roleLaneLabel = (roleId: Id) => `role:${roleId}`

export const roleIdFromLaneLabel = (label?: string) =>
	label?.startsWith("role:") ? Number(label.slice(5)) : null

export const isRoleLane = (item: {kind: Kind, label?: string}): item is Item.Sequence =>
	item.kind === Kind.Sequence && !!item.label?.startsWith("role:")

export const isRoleableKind = (kind: Kind) => [
	Kind.Audio,
	Kind.Caption,
	Kind.Image,
	Kind.Text,
	Kind.Video,
].includes(kind)

export function roleScopeFor(kind: Kind): RoleScope {
	switch (kind) {
		case Kind.Video:
		case Kind.Image:
			return "video"
		case Kind.Text:
		case Kind.Caption:
			return "text"
		case Kind.Audio:
			return "audio"
		case Kind.Transition:
			return "global"
		default:
			return "global"
	}
}

export function defaultRoleKeyFor(kind: Kind) {
	switch (roleScopeFor(kind)) {
		case "video":
			return "video"
		case "text":
			return "titles"
		case "audio":
			return "dialogue"
		case "global":
			return "effects"
	}
}

