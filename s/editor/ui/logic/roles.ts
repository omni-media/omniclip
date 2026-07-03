
import {Id} from "@omnimedia/omnitool"

import {Role, RoleScope} from "../../context/parts/state.js"

export type RoleSection = {
	label: string
	scope: RoleScope
}

export const roleSections: RoleSection[] = [
	{label: "Video Roles", scope: "video"},
	{label: "Text Roles", scope: "text"},
	{label: "Audio Roles", scope: "audio"},
	{label: "Other Roles", scope: "global"},
]

export const rolePalette = ["#34527a", "#5c3b91", "#804c08", "#1b6937", "#696969", "#8f5b1e", "#236f78"]

export const childRoles = (roles: Role[], id: Id) =>
	roles.filter(role => role.parentRoleId === id)

export const topRoles = (roles: Role[], scope: RoleScope) =>
	roles.filter(role => role.scope === scope && !role.parentRoleId)

export const roleFamilyIds = (roles: Role[], id: Id) => [
	id,
	...childRoles(roles, id).map(role => role.id),
]

export const roleEnabled = (roles: Role[], id: Id) => {
	const role = roles.find(role => role.id === id)
	const parent = roles.find(item => item.id === role?.parentRoleId)
	return role?.enabled !== false && parent?.enabled !== false
}

