
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

	activeTabId = signal(this.tabs()[0].id)

	switchTo(id: TabKind) {
		this.activeTabId(id)
	}

	switchToByIndex(index: number) {
		const tab = this.tabs()[index]
		if (tab)
			this.activeTabId(tab.id)
	}

	#getActiveIndex() {
		return this.tabs().findIndex(t => t.id === this.activeTabId())
	}

	next() {
		const currentIndex = this.#getActiveIndex()
		const nextIndex = (currentIndex + 1) % this.tabs().length
		this.activeTabId(this.tabs()[nextIndex].id)
	}

	previous() {
		const currentIndex = this.#getActiveIndex()
		const prevIndex = (currentIndex - 1 + this.tabs().length) % this.tabs().length
		this.activeTabId(this.tabs()[prevIndex].id)
	}
}

