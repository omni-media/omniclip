
import {html} from "lit"
import {dom, shadow, useCss, useMount, useSignal} from "@e280/sly"

import styleCss from "./style.css.js"
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
		useCss(styleCss)

		const query = useSignal("")
		const activeTab = useSignal<TabId>("all")
		const editingId = useSignal<TimelineAction | null>(null)
		const pending = useSignal<ShortcutCombo | null>(null)
		const conflict = useSignal<ShortcutCommand | null>(null)
		const revision = useSignal(0)

		const cancelEdit = () => {
			editingId.value = null
			pending.value = null
			conflict.value = null
		}

		const startEdit = (id: TimelineAction) => {
			editingId.value = id
			pending.value = null
			conflict.value = null
		}

		const finishEdit = () => {
			cancelEdit()
			revision.value += 1
		}

		const commitEdit = async (id: TimelineAction, combo: ShortcutCombo, replace = false) => {
			if (replace && conflict.value)
				await ctx.keybindings.setBinding(conflict.value.id, unassignedBinding)
			await ctx.keybindings.setBinding(id, combo.atom)
			finishEdit()
		}

		useMount(() => dom.events(window, {keydown: [{capture: true}, (event: KeyboardEvent) => {
			if (!editingId.value) return

			if (event.key === "Escape") {
				event.preventDefault()
				event.stopPropagation()
				cancelEdit()
				return
			}

			if (event.key === "Enter" && pending.value && !conflict.value) {
				event.preventDefault()
				event.stopPropagation()
				void commitEdit(editingId.value, pending.value)
				return
			}

			const next = shortcutFromEvent(event)
			if (!next) return

			event.preventDefault()
			event.stopPropagation()
			pending.value = next
			conflict.value = shortcutCommands.find(command =>
				command.id !== editingId.value
				&& atomHasSignature(ctx.keybindings.getBinding(command.id), next.signature)
			) ?? null
		}]}))

		const filteredCommands = () => {
			const scoped = activeTab.value === "all"
				? shortcutCommands
				: shortcutCommands.filter(c => c.group === activeTab.value)
			return scoped.filter(c =>
				commandMatches(c, ctx.keybindings.getBinding(c.id), query.value)
			)
		}

		revision.value // reactive dependency — tracks keybinding mutations
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
							.value=${query.value}
							@input=${(e: InputEvent) => query.value = (e.target as HTMLInputElement).value}
							@wa-clear=${() => query.value = ""}
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
					active=${activeTab.value}
					@wa-tab-show=${(e: CustomEvent<{name: TabId}>) => activeTab.value = e.detail.name}
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
							showLabel: activeTab.value === "all",
							renderCommand: (command: ShortcutCommand) => {
								const current = ctx.keybindings.getBinding(command.id)
								return renderCommand({
									command,
									current,
									pending: pending.value,
									conflict: conflict.value,
									onReset: async () => {
										await ctx.keybindings.resetBinding(command.id)
										if (editingId.value === command.id) cancelEdit()
										revision.value += 1
									},
									onClear: async () => {
										await ctx.keybindings.setBinding(command.id, unassignedBinding)
										finishEdit()
									},
									onCancel: cancelEdit,
									onSave: combo => commitEdit(command.id, combo),
									onReplace: combo => commitEdit(command.id, combo, true),
									isEditing: editingId.value === command.id,
									onStartEdit: () => startEdit(command.id),
									isModified: atomSignature(current) !== atomSignature(ctx.keybindings.getDefaultBinding(command.id))
								})
							},
						}))
						: html`
							<div class="empty">
								<wa-icon name="magnifying-glass"></wa-icon>
								<span>No commands match "${query.value}".</span>
								<wa-button size="small" appearance="plain" @click=${() => query.value = ""}>Clear search</wa-button>
							</div>
						`}
				</div>

				<div class="footer">
					<wa-button size="small" variant="brand" @click=${modal.cancel}>Done</wa-button>
				</div>
			</div>
		`
	})()
})
