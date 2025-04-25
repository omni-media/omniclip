import {State} from "../../types.js"
import {Actions} from "../../actions.js"
import {OmniContext, omnislate} from "../../context.js"

type ShortcutAction = (state: State) => void

export type ActionType =  "Undo" | "Redo" | "Paste" | "Copy" | "Delete" | "Split" | "Cut" | "Next frame" | "Previous frame" | "Play/Pause timeline"
interface Shortcut {
	type: string
	shortcut: string
	actionType: ActionType
	action: ShortcutAction
}

export class Shortcuts {
	#shortcutsByAction = new Map<ActionType, Shortcut>() // Lookup by action type
	#shortcutsByKey = new Map<string, Shortcut>() // Lookup by shortcut key
	#storageKey = "shortcuts"

	constructor(private context: OmniContext, private actions: Actions) {
		this.#loadShortcuts()
		this.#addZoomShortcuts()
		document.addEventListener("keydown", (e) => this.handleEvent(e, omnislate.context.state))
	}

	getKeyCombination(event: KeyboardEvent): string {
		const keys = []

		if (event.ctrlKey) keys.push("Ctrl")
		if (event.metaKey) keys.push("Cmd")
		if (event.altKey) keys.push("Alt")
		if (event.shiftKey) keys.push("Shift")

		const key = this.#normalizeKey(event.key)
		if (key && !["Control", "Meta", "Alt", "Shift"].includes(key)) {
			keys.push(key.toUpperCase())
		}

		return keys.join("+")
	}

	register(shortcut: string, type: string, actionType: ActionType, action: ShortcutAction) {
		const normalizedShortcut = shortcut.toLowerCase()

		if (this.#shortcutsByAction.has(actionType)) {
			throw new Error(`Shortcut for action "${actionType}" is already registered`)
		}
		if (this.#shortcutsByKey.has(normalizedShortcut)) {
			throw new Error(`Shortcut key "${shortcut}" is already in use`)
		}

		const shortcutEntry = { type, shortcut: normalizedShortcut, action, actionType }

		this.#shortcutsByAction.set(actionType, shortcutEntry)
		this.#shortcutsByKey.set(normalizedShortcut, shortcutEntry)
		this.#saveShortcuts()
	}

	updateShortcut(type: ActionType, newShortcut: string, override?: boolean) {
		const newShortcutKey = newShortcut.toLowerCase()

		const entry = this.#shortcutsByAction.get(type)
		if (!entry) {
			throw new Error(`Shortcut for action "${type}" not found.`)
		}

		if (override) {
			const overridedShortcut = this.#shortcutsByKey.get(newShortcutKey)
			if (overridedShortcut) {
				this.#shortcutsByAction.set(overridedShortcut.actionType, {
					...overridedShortcut,
					shortcut: "",
				})
			}
		} else if (this.#shortcutsByKey.has(newShortcutKey)) {
			throw new Error(`Shortcut key "${newShortcut}" is already in use.`)
		}

		this.#shortcutsByKey.delete(entry.shortcut)

		entry.shortcut = newShortcutKey
		this.#shortcutsByAction.set(type, entry)
		this.#shortcutsByKey.set(newShortcutKey, entry)

		this.#saveShortcuts()
	}

	resetToDefaults() {
		this.#shortcutsByAction.clear()
		this.#shortcutsByKey.clear()
		this.#registerDefaults()
		this.#saveShortcuts()
	}

	handleEvent(event: KeyboardEvent, state: State) {
		const path = event.composedPath()
		const active = path[0] as HTMLElement

		// Ignore shortcuts if typing inside input/textarea/contentEditable
		if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
			return
		}

		const shortcut = this.getKeyCombination(event).toLowerCase()
		const entry = this.#shortcutsByKey.get(shortcut)
		if (entry && typeof entry.action === "function") {
			event.preventDefault()
			entry.action(state)
		}
	}

	#normalizeKey(key: string) {
		if (key === " ") return "Space"
		return key
	}

	#saveShortcuts() {
		const serializedShortcuts = JSON.stringify(
			Array.from(this.#shortcutsByAction.values()).map(({type, actionType, shortcut}) => ({
				shortcut,
				type,
				actionType,
			}))
		)
		localStorage.setItem(this.#storageKey, serializedShortcuts)
	}

	#loadShortcuts() {
		const storedShortcuts = localStorage.getItem(this.#storageKey)

		if (storedShortcuts) {
			try {
				// Parse stored shortcuts
				const parsedShortcuts = JSON.parse(storedShortcuts) as {shortcut: string; type: string; actionType: ActionType}[]
				parsedShortcuts.forEach(({shortcut, type, actionType}) => {
					const action = this.#getDefaultActionForDescription(actionType)
					if (action) {
						const shortcutEntry = {type, shortcut, actionType, action}
						this.#shortcutsByAction.set(actionType, shortcutEntry)
						this.#shortcutsByKey.set(shortcut.toLowerCase(), shortcutEntry)
					}
				})
			} catch (error) {
				console.error("Failed to parse shortcuts from storage, resetting to defaults:", error)
			}
		}

		// Add defaults for missing shortcuts
		DEFAULT_SHORTCUTS.forEach(({shortcut, type, actionType}) => {
			if (!this.#shortcutsByAction.has(actionType)) {
				const action = this.#getDefaultActionForDescription(actionType)
				if (action) {
					const shortcutEntry = {type, shortcut, actionType, action}
					this.#shortcutsByAction.set(actionType, shortcutEntry)
					this.#shortcutsByKey.set(shortcut.toLowerCase(), shortcutEntry)
				}
			}
		})
	}

	#registerDefaults() {
		DEFAULT_SHORTCUTS.forEach(({actionType, type, shortcut}) => {
			const action = this.#getDefaultActionForDescription(actionType)
			if (action) {
				this.register(shortcut, type, actionType, action)
			}
		})
	}

	#getDefaultActionForDescription(description: ActionType): ShortcutAction | null {
		switch (description) {
			case "Copy":
				return (state) => this.context.controllers.timeline.copy(state)
			case "Paste":
				return (state) => this.context.controllers.timeline.paste(state)
			case "Undo":
				return () => this.context.undo()
			case "Redo":
				return () => this.context.redo()
			case "Delete":
				return (state) => this.controllers.timeline.remove_selected_effect(state)
			case "Split":
				return (state) => this.controllers.timeline.split(state)
			case "Cut":
				return (state) => this.controllers.timeline.cut(state)
			case "Play/Pause timeline":
				return () => this.controllers.compositor.toggle_video_playing()
			case "Previous frame":
				return (state) => {
					this.controllers.compositor.set_video_playing(false)
					this.actions.set_timecode(state.timecode - 1000 / state.timebase, {omit: true})
					this.controllers.compositor.seek(state.timecode - 1000 / state.timebase, true).then(() =>
						this.controllers.compositor.compose_effects(state.effects, state.timecode)
					)
				}
			case "Next frame":
				return (state) => {
					this.controllers.compositor.set_video_playing(false)
					this.actions.set_timecode(state.timecode + 1000 / state.timebase, {omit: true})
					this.controllers.compositor.seek(state.timecode + 1000 / state.timebase, true).then(() =>
						this.controllers.compositor.compose_effects(state.effects, state.timecode)
					)
				}

			default: return null
		}
	}

	#addZoomShortcuts() {
		document.addEventListener(
			"wheel",
			(event) => {
				const { zoom } = omnislate.context.state
				const target = event.target as HTMLElement
				if (target.getAttribute("view") === "timeline") {
					if (event.ctrlKey) {
						event.preventDefault()
						if (event.deltaY < 0 && zoom <= 2) {
							this.actions.zoom_in()
						} else if (event.deltaY > 0 && zoom >= -13) {
							this.actions.zoom_out()
						}
					}
				}
			},
			{ passive: false }
		)
	}

	get controllers() {
		return this.context.controllers
	}

	listShortcuts(type?: string): {shortcut: string; actionType: ActionType}[] {
		const currentShortcuts = Array.from(this.#shortcutsByAction.values())

		// Sort based on the order defined in DEFAULT_SHORTCUTS
		const sorted = DEFAULT_SHORTCUTS.map(({actionType}) => actionType)

		return currentShortcuts
			.filter((shortcut) => !type || shortcut.type === type)
			.sort((a, b) => {
				const indexA = sorted.indexOf(a.actionType)
				const indexB = sorted.indexOf(b.actionType)
				return indexA - indexB
			})
			.map(({shortcut, actionType}) => ({
				shortcut,
				actionType,
			}))
	}
}

export const DEFAULT_SHORTCUTS: {actionType: ActionType; type: string; shortcut: string}[] = [
	{ actionType: "Copy", type: "basic", shortcut: "ctrl+c" },
	{ actionType: "Paste", type: "basic", shortcut: "ctrl+v" },
	{ actionType: "Undo", type: "basic", shortcut: "ctrl+z" },
	{ actionType: "Redo", type: "basic", shortcut: "ctrl+shift+z" },
	{ actionType: "Delete", type: "basic", shortcut: "delete" },
	{ actionType: "Split", type: "basic", shortcut: "ctrl+b" },
	{ actionType: "Cut", type: "basic", shortcut: "ctrl+x" },
	{ actionType: "Previous frame", type: "basic", shortcut: "ArrowLeft" },
	{ actionType: "Next frame", type: "basic", shortcut: "ArrowRight" },
	{ actionType: "Play/Pause timeline", type: "basic", shortcut: "space" },
]
