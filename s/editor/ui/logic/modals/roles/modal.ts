
import {html} from 'lit'
import {loot, shadow, useCss, useOnce, useSignal} from '@e280/sly'

import styleCss from './style.css.js'
import {RolesResult} from './renderers/types.js'
import {renderRoleRow} from './renderers/role-row.js'
import {renderSubroleRow} from './renderers/subrole-row.js'
import {renderRoleSection} from './renderers/role-section.js'
import {Role, RoleScope} from '../../../../context/parts/state.js'
import modalCss from '../../../../context/parts/modal/modal.css.js'
import {RoleLookup} from '../../../../context/parts/roles/lookup.js'
import {ModalDefinition} from '../../../../context/parts/modal/types.js'
import {rolePalette, roleSections} from '../../parts/roles/constants.js'

export const rolesModal = (): ModalDefinition<RolesResult> => ({
	label: 'Edit Roles',

	render: (context, modal) => shadow(() => {
		useCss(modalCss, styleCss)

		const roles = useSignal<Role[]>(context.strata.outliner.state.roles.map(role => ({...role})))
		const drop = useSignal<{id: number, placement: "before" | "after"} | null>(null)

		const setRoles = (next: Role[]) => {
			roles.value = next
		}

		const lookup = () => new RoleLookup(roles.value)

		const moveTo = (dragId: number, dropId: number, after: boolean) => {
			const roleLookup = lookup()
			const drag = roleLookup.get(dragId)
			const drop = roleLookup.get(dropId)

			if (!drag || !drop || drag.id === drop.id)
				return

			const groupIds = new Set([
				drag.id,
				...roleLookup.siblings(drag.id).map(role => role.id),
			])

			if (!groupIds.has(drop.id))
				return

			const group = roles.value.filter(role => groupIds.has(role.id))
			const nextGroup = group.filter(role => role.id !== drag.id)
			const targetIndex = nextGroup.findIndex(role => role.id === drop.id)
			nextGroup.splice(targetIndex + (after ? 1 : 0), 0, drag)

			setRoles(roles.value.map(role =>
				group.some(item => item.id === role.id)
					? nextGroup.shift()!
					: role
			))
		}

		const dnd = useOnce(() => new loot.DragAndDrops<{id: number}, {id: number}>({
			acceptDrop: (_e, draggy, droppy) => {
				if (drop.value?.id === droppy.id)
					moveTo(draggy.id, droppy.id, drop.value.placement === "after")
				drop.value = null
			},
		}))

		const makeRole = (role: Omit<Role, 'id' | 'key' | 'gain' | 'enabled'>): Role => {
			const id = context.omni.getId()

			return {
				id,
				key: `custom-${id}`,
				gain: 1,
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

		const canDropOn = (target: Role) => {
			const draggy = dnd.dragging
			return !!draggy && lookup()
				.siblings(target.id)
				.some(role => role.id === draggy.id)
		}

		const dropzone = (role: Role) => {
			const zone = dnd.dropzone(() => ({id: role.id}))
			return {
				...zone,
				dragover: (event: DragEvent) => {
					zone.dragover(event)
					if (!canDropOn(role))
						return

					const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
					drop.value = {
						id: role.id,
						placement: event.clientY > rect.top + rect.height / 2 ? "after" : "before",
					}
				},
				dragleave: (event: DragEvent) => {
					zone.dragleave(event)
					const target = event.currentTarget as HTMLElement
					if (!target.contains(event.relatedTarget as Node | null) && drop.value?.id === role.id)
						drop.value = null
				},
			}
		}

		const dropPlacement = (role: Role) =>
			canDropOn(role) && drop.value?.id === role.id
				? drop.value.placement
				: null

		const drag = (role: Role) => ({
			placement: dropPlacement(role),
			dropzone: dropzone(role),
			dragzone: dnd.dragzone(() => ({id: role.id}))
		})

		const renderRole = (role: Role) => html`
			${renderRoleRow({
				role,
				drag: drag(role),
				onUpdate: update,
				onRemove: remove,
				onAddSubrole: addSubrole
			})}

			${lookup().children(role.id)
				.map(subrole => renderSubroleRow({
					role: subrole,
					parent: role,
					onUpdate: update,
					onRemove: remove,
					drag: drag(subrole)
				}))}
		`

		const apply = () => {
			const valid = roles.value.filter(role => role.name.trim())
			const validIds = new Set(valid.map(role => role.id))
			const validRoles = new RoleLookup(valid)
			const original = new Map(roles.value.map(role => [role.id, role]))

			context.strata.outliner.mutate(state => {
				state.roles = valid

				for (const meta of state.items) {
					if (validIds.has(meta.roleId))
						continue

					const parentRoleId = original.get(meta.roleId)?.parentRoleId
					const item = context.session.index.getItem(meta.itemId)

					meta.roleId = parentRoleId && validIds.has(parentRoleId)
						? parentRoleId
						: validRoles.defaultFor(item.kind).id
				}
			})

			context.session.roles.organizeLanes()
			context.session.canvas.scheduleDraw()
			modal.resolve(valid)
		}

		return html`
			<div class="roles-modal">
				${roleSections.map(section => renderRoleSection({
					section,
					renderRole,
					onAddRole: addRole,
					roles: lookup().top(section.scope)
				}))}

				<div class="modal-footer">
					<wa-button variant="neutral" @click=${modal.cancel}>Cancel</wa-button>
					<wa-button variant="neutral" @click=${apply}>Apply</wa-button>
				</div>
			</div>
		`
	})()
})

