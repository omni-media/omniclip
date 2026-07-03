
import {html} from "lit"
import {Item} from "@omnimedia/omnitool"

import {EditorContext} from "../../../../../../../../context/context.js"
import {roleScopeFor} from "../../../../../../../../context/parts/state.js"

export function RoleControls(context: EditorContext, item: Item.Any) {
	const outliner = context.strata.outliner
	const meta = outliner.state.items.find(meta => meta.itemId === item.id)
	const roles = outliner.state.roles.filter(role => role.scope === roleScopeFor(item.kind))
	const topRoles = roles.filter(role => !role.parentRoleId)
	const selectedRoleId = meta?.roleId ?? roles[0]?.id

	const roleEnabled = (roleId: number) => {
		const role = outliner.state.roles.find(role => role.id === roleId)
		const parent = outliner.state.roles.find(item => item.id === role?.parentRoleId)
		return role?.enabled !== false && parent?.enabled !== false
	}

	const setRole = (roleId: number) => {
		outliner.mutate(state => {
			const meta = state.items.find(meta => meta.itemId === item.id)
			if (meta)
				meta.roleId = roleId
		})

		context.strata.timeline.mutate(state => {
			const target = state.items.find(target => target.id === item.id)
			if (target)
				target.enabled = roleEnabled(roleId)
		})
	}

	const renderRoleOptions = () => topRoles.flatMap(role => [
		html`<wa-option value=${String(role.id)}>${role.name}</wa-option>`,
		...roles
			.filter(subrole => subrole.parentRoleId === role.id)
			.map(subrole => html`
				<wa-option value=${String(subrole.id)}>&nbsp;&nbsp;${subrole.name}</wa-option>
			`)
	])

	return html`
		<div class="controls-group">
			<h4 class="heading">Role</h4>
			<wa-select
				size="small"
				.value=${String(selectedRoleId ?? "")}
				@change=${(event: Event) => setRole(Number((event.target as HTMLSelectElement).value))}
			>
				${renderRoleOptions()}
			</wa-select>
		</div>
	`
}

