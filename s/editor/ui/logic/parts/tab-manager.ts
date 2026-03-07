
import {signal} from "@e280/strata"

export type TabKind = "outliner" | "export" | "edit" | "inspector"

export type Tab = {
	id: TabKind
}

export class TabManager {
	tabs = signal<Tab[]>([
		{id: "outliner"},
		{id: "export"},
		{id: "edit"},
		{id: "inspector"}
	])

	activeTabId = signal(this.tabs.value[0].id)

	switchTo(id: TabKind) {
		this.activeTabId.value = id
	}

	switchToByIndex(index: number) {
		const tab = this.tabs.value[index]
		if (tab)
			this.activeTabId.value = tab.id
	}

	#getActiveIndex() {
		return this.tabs.value.findIndex(t => t.id === this.activeTabId.value)
	}

	next() {
		const currentIndex = this.#getActiveIndex()
		const nextIndex = (currentIndex + 1) % this.tabs.value.length
		this.activeTabId.value = this.tabs.value[nextIndex].id
	}

	previous() {
		const currentIndex = this.#getActiveIndex()
		const prevIndex = (currentIndex - 1 + this.tabs.value.length) % this.tabs.value.length
		this.activeTabId.value = this.tabs.value[prevIndex].id
	}
}

