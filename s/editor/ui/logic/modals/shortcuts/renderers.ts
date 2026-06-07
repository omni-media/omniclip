
import {html} from "lit"
import type {Atom} from "@benev/tact"

import {combosFromAtom, ShortcutCombo} from "./utils.js"
import type {ShortcutCommand, shortcutGroups} from "../../../../context/controllers/input/meta.js"

export function renderShortcut(atom: Atom) {
	const combos = combosFromAtom(atom)
	if (!combos.length)
		return html`<span class="unassigned">Unassigned</span>`

	return html`
		<div class="chips">
			${combos.map((combo, index) => html`
				<span class="combo">
					${index > 0 ? html`<span class="plus">or</span>` : null}
					${combo.keys.map((key, keyIndex) => html`
						${keyIndex > 0 ? html`<span class="plus">+</span>` : null}
						<span class="chip">${key}</span>
					`)}
				</span>
			`)}
		</div>
	`
}

export function renderCommand(props: {
	command: ShortcutCommand
	current: Atom
	isEditing: boolean
	isModified: boolean
	pending: ShortcutCombo | null
	conflict: ShortcutCommand | null
	onStartEdit: () => void
	onReset: () => void
	onClear: () => void
	onCancel: () => void
	onSave: (combo: ShortcutCombo) => void
	onReplace: (combo: ShortcutCombo) => void
}) {
	const {
		command,
		current,
		isEditing,
		isModified,
		pending,
		conflict,
		onStartEdit,
		onReset,
		onClear,
		onCancel,
		onSave,
		onReplace,
	} = props

	return html`
		<div class="row" ?data-editing=${isEditing}>
			<div class="command">
				<div class="command-name">
					<span>${command.name}</span>
					${isModified && !isEditing ? html`<span class="custom">Custom</span>` : null}
				</div>
				${command.description ? html`
					<div class="description">${command.description}</div>
				` : null}
			</div>

			${isEditing ? html`
				<div class="editing">
					${pending
						? renderShortcut(pending.atom)
						: html`<span class="recording">Press keys...</span>`}
					<wa-button size="small" appearance="plain" @click=${onClear}>Clear</wa-button>
					<wa-button size="small" appearance="plain" @click=${onCancel}>Cancel</wa-button>
					${pending && !conflict ? html`
						<wa-button size="small" variant="brand" @click=${() => onSave(pending)}>Save</wa-button>
					` : null}
				</div>
				${conflict && pending ? html`
					<div class="conflict">
						<span>Already used by <strong>${conflict.name}</strong></span>
						<wa-button class="replace" size="small" variant="brand" @click=${() => onReplace(pending)}>Replace</wa-button>
						<wa-button size="small" appearance="plain" @click=${onCancel}>Cancel</wa-button>
					</div>
				` : null}
			` : html`
				<div class="binding">
					<button class="chip-button" title="Edit shortcut" @click=${onStartEdit}>
						${renderShortcut(current)}
					</button>
					<wa-button
						size="small"
						appearance="plain"
						?disabled=${!isModified}
						title="Reset to default"
						@click=${onReset}
					>
						Reset
					</wa-button>
				</div>
			`}
		</div>
	`
}

export function renderGroup(props: {
	group: typeof shortcutGroups[number]
	commands: ShortcutCommand[]
	showLabel: boolean
	renderCommand: (command: ShortcutCommand) => unknown
}) {
	const {group, commands, showLabel, renderCommand} = props
	const items = commands.filter(command => command.group === group.id)
	if (!items.length)
		return null

	return html`
		<section class="group">
			${showLabel ? html`
				<div class="group-label">${group.label}</div>
			` : null}
			<div class="rows">
				${items.map(renderCommand)}
			</div>
		</section>
	`
}

