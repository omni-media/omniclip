
import {html} from "lit"
import {Item} from "@omnimedia/omnitool"

import {EditorContext} from "../../../../../../../../context/context.js"
import {roleScopeFor} from "../../../../../../../../context/parts/roles/utils.js"

export function RoleControls(context: EditorContext, item: Item.Any) {
	const outliner = context.strata.outliner
	const meta = outliner.state.items.find(meta => meta.itemId === item.id)
	const roles = outliner.state.roles.filter(role => role.scope === roleScopeFor(item.kind))
	const topRoles = roles.filter(role => !role.parentRoleId)
	const selectedRoleId = meta?.roleId ?? roles[0]?.id

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
				@change=${(event: Event) => context.session.roles.assign(item.id, Number((event.target as HTMLSelectElement).value))}
			>
				${renderRoleOptions()}
			</wa-select>
		</div>
	`
}

