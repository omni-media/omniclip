
import {html} from "lit"
import {shadow, useCss} from "@e280/sly"
import {repeat} from "lit/directives/repeat.js"

import styleCss from "./style.css.js"
import {TabManager} from "../../../../logic/parts/tab-manager.js"
import themeCss from "../../../../../theme.css.js"

export const TabBar = shadow((manager: TabManager) => {
	useCss(themeCss, styleCss)

	return html`
		<nav>
			${repeat(manager.tabs.value, tab => tab.id, tab => html`
				<button
					?data-active=${tab.id === manager.activeTabId.value}
					@click=${() => manager.switchTo(tab.id)}>
					${tab.id}
				</button>
			`)}
		</nav>
	`
})
