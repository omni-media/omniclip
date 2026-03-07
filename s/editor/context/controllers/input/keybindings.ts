import * as tact from "@benev/tact"

import {TabManager} from "../../../ui/logic/parts/tab-manager.js"
import {bindings} from "./bindings.js"

export class Keybindings {
	#running = false
	#request = 0
	#unsubscribe: () => void

	static async setup(tabs: TabManager) {
		const deck = await tact.Deck.load({
			portCount: 1,
			bindings,
			kv: tact.localStorageKv(),
		})
		deck.hub.plug(new tact.PrimaryDevice())
		return new Keybindings(deck, tabs)
	}

	constructor(private deck: tact.Deck<typeof bindings>, private tabs: TabManager) {
		this.#running = true

		this.#unsubscribe = this.tabs.activeTabId.on(
			this.#syncActiveMode
		)
		this.#syncActiveMode()
		this.#loop()
	}

	dispose() {
		this.#running = false
		this.#unsubscribe()
		if (this.#request)
			cancelAnimationFrame(this.#request)
	}

	#syncActiveMode = () => {
		const activeTabId = this.tabs.activeTabId.value
		const port = this.deck.hub.ports[0]
		if (port) {
			port.modes.clear()
			port.modes.add("editor")
			port.modes.add(activeTabId)
		}
	}

	#loop = () => {
		if (!this.#running) return

		const [port] = this.deck.hub.poll()

		if (port) {
			const {editor, timeline} = port.actions

			if (editor.next_tab.down) this.tabs.next()
			if (editor.previous_tab.down) this.tabs.previous()

			if (editor.switch_to_tab_1.down) this.tabs.switchToByIndex(0)
			if (editor.switch_to_tab_2.down) this.tabs.switchToByIndex(1)
			if (editor.switch_to_tab_3.down) this.tabs.switchToByIndex(2)
			if (editor.switch_to_tab_4.down) this.tabs.switchToByIndex(3)
			if (editor.switch_to_tab_5.down) this.tabs.switchToByIndex(4)

			if (timeline.play_pause.down) {
				console.log("play/Pause timeline")
			}
		}

		this.#request = requestAnimationFrame(this.#loop)
	}
}
