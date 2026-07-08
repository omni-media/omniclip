
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
		case Kind.Text:
		case Kind.Caption:
			return "video"
		case Kind.Audio:
			return "audio"
		default:
			return "video"
	}
}

export function defaultRoleKeyFor(kind: Kind) {
	switch (roleScopeFor(kind)) {
		case "video":
			return kind === Kind.Text || kind === Kind.Caption
				? "titles"
				: "video"
		case "audio":
			return "dialogue"
	}
}

