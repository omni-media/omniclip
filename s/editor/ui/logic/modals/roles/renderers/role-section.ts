
import {TemplateResult, html} from "lit"

import {Role, RoleScope} from "../../../../../context/parts/state.js"
import addSvg from "../../../../icons/gravity-ui/add.svg.js"
import {RoleSection} from "./types.js"

export function renderRoleSection(props: {
	section: RoleSection
	roles: Role[]
	renderRole: (role: Role) => TemplateResult
	onAddRole: (scope: RoleScope) => void
}) {
	const {section, roles, renderRole, onAddRole} = props

	const addRole = (event: Event) => {
		event.stopPropagation()
		onAddRole(section.scope)
	}

	return html`
		<section class="role-section">
			<div class="section-heading">
				<span>${section.label}</span>

				<button
					class="text-button"
					title="Add role"
					@click=${addRole}
				>
					${addSvg}
					<span>Role</span>
				</button>
			</div>

			<div class="role-list">
				${roles.map(renderRole)}
			</div>
		</section>
	`
}

