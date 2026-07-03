
import {TemplateResult, html} from "lit"
import {repeat} from "lit/directives/repeat.js"

import {Role} from "../../../../../../../context/parts/state.js"
import {RoleSection} from "../../../../../../logic/modals/roles/renderers/types.js"

export function renderRoleSection(props: {
	section: RoleSection
	roles: Role[]
	renderRole: (role: Role) => TemplateResult
}) {
	const {section, roles, renderRole} = props

	if (!roles.length)
		return null

	return html`
		<div class="role-section">
			<div class="role-section-title">${section.label}</div>

			<div class="role-list">
				${repeat(roles, role => role.id, renderRole)}
			</div>
		</div>
	`
}

