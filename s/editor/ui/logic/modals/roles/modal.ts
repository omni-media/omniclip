
import {html} from 'lit'
import {shadow, useCss, useSignal} from '@e280/sly'

import styleCss from './style.css.js'
import {RolesResult} from './renderers/types.js'
import {renderRoleRow} from './renderers/role-row.js'
import {renderSubroleRow} from './renderers/subrole-row.js'
import {renderRoleSection} from './renderers/role-section.js'
import modalCss from '../../../../context/parts/modal/modal.css.js'
import {ModalDefinition} from '../../../../context/parts/modal/types.js'
import {childRoles, rolePalette, roleSections, topRoles} from '../../roles.js'
import {Role, RoleScope, defaultRoleKeyFor} from '../../../../context/parts/state.js'

export const rolesModal = (): ModalDefinition<RolesResult> => ({
	label: 'Edit Roles',

	render: (context, modal) => shadow(() => {
		useCss(modalCss, styleCss)

		const roles = useSignal<Role[]>(context.strata.outliner.state.roles.map(role => ({...role})))

		const setRoles = (next: Role[]) => {
			roles.value = next
		}

		const makeRole = (role: Omit<Role, 'id' | 'key' | 'enabled'>): Role => {
			const id = context.omni.getId()

			return {
				id,
				key: `custom-${id}`,
				enabled: true,
				...role
			}
		}

		const update = (id: number, patch: Partial<Role>) =>
			setRoles(roles.value.map(role =>
				role.id === id
					? {...role, ...patch}
					: role
			))

		const addRole = (scope: RoleScope) =>
			setRoles([...roles.value, makeRole({
				name: 'New Role',
				scope,
				color: rolePalette[roles.value.length % rolePalette.length]
			})])

		const addSubrole = (parent: Role) =>
			setRoles([...roles.value, makeRole({
				name: 'New Subrole',
				scope: parent.scope,
				color: parent.color,
				parentRoleId: parent.id
			})])

		const remove = (role: Role) =>
			setRoles(roles.value.filter(item =>
				item.id !== role.id &&
				item.parentRoleId !== role.id
			))

		const renderRole = (role: Role) => html`
			${renderRoleRow({
				role,
				onUpdate: update,
				onAddSubrole: addSubrole,
				onRemove: remove
			})}

			${childRoles(roles.value, role.id)
				.map(child => renderSubroleRow({
					role: child,
					parent: role,
					onUpdate: update,
					onRemove: remove
				}))}
		`

		const apply = () => {
			const valid = roles.value.filter(role => role.name.trim())
			const validIds = new Set(valid.map(role => role.id))
			const original = new Map(roles.value.map(role => [role.id, role]))

			context.strata.outliner.mutate(state => {
				state.roles = valid

				for (const meta of state.items) {
					if (validIds.has(meta.roleId))
						continue

					const parentRoleId = original.get(meta.roleId)?.parentRoleId
					const item = context.session.index.getItemMaybe(meta.itemId)
					const key = item && defaultRoleKeyFor(item.kind)
					const role = key && valid.find(role => role.key === key)

					meta.roleId = parentRoleId && validIds.has(parentRoleId)
						? parentRoleId
						: role?.id ?? meta.roleId
				}
			})

			context.session.canvas.scheduleDraw()
			modal.resolve(valid)
		}

		return html`
			<div class="roles-modal">
				${roleSections.map(section => renderRoleSection({
					section,
					roles: topRoles(roles.value, section.scope),
					renderRole,
					onAddRole: addRole
				}))}

				<div class="modal-footer">
					<wa-button variant="neutral" @click=${modal.cancel}>Cancel</wa-button>
					<wa-button variant="neutral" @click=${apply}>Apply</wa-button>
				</div>
			</div>
		`
	})()
})

