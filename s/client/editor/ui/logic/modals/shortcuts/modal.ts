
import {html} from "lit"
import {dom, shadow, useCss, useMount, useSignal} from "@e280/sly"

import styleCss from "./style.css.js"
import modalCss from "../../../../context/parts/modal/modal.css.js"
import {ModalDefinition} from "../../../../context/parts/modal/types.js"
import {
	shortcutCommands,
	shortcutGroups,
	TimelineAction,
	unassignedBinding,
	type ShortcutCommand,
} from "../../../../context/controllers/input/meta.js"
import {renderCommand, renderGroup} from "./renderers.js"
import {
	atomHasSignature,
	atomSignature,
	commandMatches,
	ShortcutCombo,
	shortcutFromEvent,
	TabId,
} from "./utils.js"

import "@awesome.me/webawesome/dist/components/tab/tab.js"
import "@awesome.me/webawesome/dist/components/icon/icon.js"
import "@awesome.me/webawesome/dist/components/input/input.js"
import "@awesome.me/webawesome/dist/components/button/button.js"
import "@awesome.me/webawesome/dist/components/tab-group/tab-group.js"
import "@awesome.me/webawesome/dist/components/tab-panel/tab-panel.js"

const allTabs = [{id: "all" as TabId, label: "All"}, ...shortcutGroups]

export const shortcutsModal = (): ModalDefinition<void> => ({
	label: html`
		<div>
			<wa-icon name="keyboard"></wa-icon>
			<span>Keyboard Shortcuts</span>
		</div>
	`,

	render: (ctx, modal) => shadow(() => {
		useCss(modalCss, styleCss)

		const query = useSignal("")
		const activeTab = useSignal<TabId>("all")
		const editingId = useSignal<TimelineAction | null>(null)
		const pending = useSignal<ShortcutCombo | null>(null)
		const conflict = useSignal<ShortcutCommand | null>(null)
		const revision = useSignal(0)

		const cancelEdit = () => {
			editingId(null)
			pending(null)
			conflict(null)
		}

		const startEdit = (id: TimelineAction) => {
			editingId(id)
			pending(null)
			conflict(null)
		}

		const finishEdit = () => {
			cancelEdit()
			revision(revision() + 1)
		}

		const commitEdit = async (id: TimelineAction, combo: ShortcutCombo, replace = false) => {
			const conflicting = conflict()
			if (replace && conflicting)
				await ctx.keybindings.setBinding(conflicting.id, unassignedBinding)
			await ctx.keybindings.setBinding(id, combo.atom)
			finishEdit()
		}

		useMount(() => dom.events(window, {keydown: [{capture: true}, (event: KeyboardEvent) => {
			const id = editingId()
			const combo = pending()
			if (!id) return

			if (event.key === "Escape") {
				event.preventDefault()
				event.stopPropagation()
				cancelEdit()
				return
			}

			if (event.key === "Enter" && combo && !conflict()) {
				event.preventDefault()
				event.stopPropagation()
				commitEdit(id, combo)
				return
			}

			const next = shortcutFromEvent(event)
			if (!next) return

			event.preventDefault()
			event.stopPropagation()
			pending(next)
			conflict(shortcutCommands.find(command =>
				command.id !== editingId()
				&& atomHasSignature(ctx.keybindings.getBinding(command.id), next.signature)
			) ?? null)
		}]}))

		const filteredCommands = () => {
			const scoped = activeTab() === "all"
				? shortcutCommands
				: shortcutCommands.filter(c => c.group === activeTab())
			return scoped.filter(c =>
				commandMatches(c, ctx.keybindings.getBinding(c.id), query())
			)
		}

		revision()
		const commands = filteredCommands()

		return html`
			<div class="shortcuts-modal">
				<div class="toolbar">
					<div class="search">
						<wa-input
							type="search"
							size="small"
							appearance="filled"
							with-clear
							placeholder="Search commands..."
							.value=${query()}
							@input=${(e: InputEvent) => query((e.target as HTMLInputElement).value)}
							@wa-clear=${() => query("")}
						>
							<wa-icon slot="start" name="magnifying-glass"></wa-icon>
						</wa-input>
					</div>
					<wa-button size="small" variant="neutral" @click=${async () => {
						await ctx.keybindings.resetAll()
						finishEdit()
					}}>Reset All</wa-button>
				</div>

				<wa-tab-group
					class="tabs"
					active=${activeTab()}
					@wa-tab-show=${(e: CustomEvent<{name: TabId}>) => activeTab(e.detail.name)}
				>
					${allTabs.map(tab => html`
						<wa-tab panel=${tab.id}>${tab.label}</wa-tab>
						<wa-tab-panel name=${tab.id}></wa-tab-panel>
					`)}
				</wa-tab-group>

				<div class="list">
					${commands.length
						? shortcutGroups.map(group => renderGroup({
							group,
							commands,
							showLabel: activeTab() === "all",
							renderCommand: (command: ShortcutCommand) => {
								const current = ctx.keybindings.getBinding(command.id)
								return renderCommand({
									command,
									current,
									pending: pending(),
									conflict: conflict(),
									onReset: async () => {
										await ctx.keybindings.resetBinding(command.id)
										if (editingId() === command.id) cancelEdit()
										revision(revision() + 1)
									},
									onClear: async () => {
										await ctx.keybindings.setBinding(command.id, unassignedBinding)
										finishEdit()
									},
									onCancel: cancelEdit,
									onSave: combo => commitEdit(command.id, combo),
									onReplace: combo => commitEdit(command.id, combo, true),
									isEditing: editingId() === command.id,
									onStartEdit: () => startEdit(command.id),
									isModified: atomSignature(current) !== atomSignature(ctx.keybindings.getDefaultBinding(command.id))
								})
							},
						}))
						: html`
							<div class="empty">
								<wa-icon name="magnifying-glass"></wa-icon>
								<span>No commands match "${query()}".</span>
								<wa-button size="small" appearance="plain" @click=${() => query("")}>Clear search</wa-button>
							</div>
						`}
				</div>

				<div class="modal-footer">
					<wa-button size="small" variant="neutral" @click=${modal.cancel}>Done</wa-button>
				</div>
			</div>
		`
	})()
})
