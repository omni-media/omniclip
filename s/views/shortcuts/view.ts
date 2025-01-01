import {html} from "lit"
import {styles} from "./styles.js"
import {shadow_view} from "../../context/context.js"
import keyboardSvg from "../../icons/gravity-ui/keyboard.svg.js"
import {ActionType} from "../../context/controllers/shortcuts/controller.js"

export const ShortcutsManager = shadow_view((use) => () => {
	use.styles(styles)
	const manager = use.context.controllers.shortcuts

	const [isModalOpened, setIsModalOpened] = use.state(false)
	const [_, setPressedKeys, getPressedKeys] = use.state(new Set<string>())
	const [conflict, setConflict] = use.state<{newShortcut: string, type: ActionType} | null>(null)

	// Render the list of shortcuts
	const renderShortcutsList = () =>
		manager.listShortcuts().map(({ shortcut, actionType }) =>
			html`
				<tr>
					<td>${actionType}</td>
					<td>
						<input
							type="text"
							.value=${shortcut}
							@keyup=${(e: PointerEvent) => onPointerUpInput(e, actionType)}
							@keydown=${onPointerDownInput}
							class="shortcut-input"
						>
					</td>
				</tr>
			`
		)

	const onPointerDownInput = (e: KeyboardEvent) => {
		e.preventDefault()
		const inputElement = e.target as HTMLInputElement
		const keyCombination = manager.getKeyCombination(e)
		setPressedKeys(new Set(getPressedKeys()).add(keyCombination))
		inputElement.value = keyCombination
	}

	const onPointerUpInput = (e: PointerEvent, type: ActionType) => {
		const inputElement = e.target as HTMLInputElement
		const finalShortcut = inputElement.value.toLowerCase()
		try {
			manager.updateShortcut(type, finalShortcut)
		} catch (error) {
			setConflict({newShortcut: finalShortcut, type})
		}
		setPressedKeys(new Set())
		inputElement.blur()
	}

	const resolveConflict = () => {
		if (conflict) {
			manager.updateShortcut(conflict.type, conflict.newShortcut, true)
			setConflict(null)
		}
	}

	const cancelConflict = () => setConflict(null)

	return html`
		<span class=open @click=${() => setIsModalOpened(true)}>${keyboardSvg}</span>
		<div id="shortcut-modal" ?data-hidden=${!isModalOpened} class="modal">
			<div class="modal-content">
				<h2>Customize Shortcuts</h2>
				<table id="shortcut-table">
					<thead>
						<tr>
							<th>Action</th>
							<th>Current Shortcut</th>
						</tr>
					</thead>
					<tbody>
						${renderShortcutsList()}
					</tbody>
				</table>
				<button
					@click=${() => {
						manager.resetToDefaults()
						use.rerender()
					}}
					id="reset-defaults"
				>
					Reset to Defaults
				</button>
				<button @click=${() => setIsModalOpened(false)} id="close-modal">Close</button>
			</div>
		</div>

		<!-- Conflict warning dialog -->
		${conflict
			? html`
				<div id="conflict-warning" class="modal">
					<div class="modal-content">
						<p>
							The shortcut "${conflict.newShortcut}" is already assigned. Do you want to override it?
						</p>
						<button @click=${resolveConflict}>Yes</button>
						<button @click=${cancelConflict}>No</button>
					</div>
				</div>
			`
			: null}
	`
})
