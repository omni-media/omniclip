
import {html} from "lit"
import {shadow, useCss, useSignal} from "@e280/sly"

import styleCss from "./style.css.js"
import {TagsPanel} from "./views/tags/view.js"
import {ClipsView} from "./views/clips/view.js"
import themeCss from "../../../../../../theme.css.js"
import type {EditorContext} from "../../../../../../context/context.js"

import "@awesome.me/webawesome/dist/components/tab/tab.js"
import "@awesome.me/webawesome/dist/components/tab-group/tab-group.js"
import "@awesome.me/webawesome/dist/components/tab-panel/tab-panel.js"

export const OutlinerTab = shadow((context: EditorContext) => {
	useCss(themeCss, styleCss)
	const activeTab = useSignal("clips")

	const selectTab = (event: CustomEvent<{name: string}>) => {
		if (event.target === event.currentTarget) activeTab(event.detail.name)
	}

	return html`
		<wa-tab-group .active=${activeTab()} @wa-tab-show=${selectTab}>
			<wa-tab panel="clips" ?data-active=${activeTab() === "clips"}>Clips</wa-tab>
			<wa-tab panel="tags" ?data-active=${activeTab() === "tags"}>Tags</wa-tab>
			<wa-tab-panel name="clips">${ClipsView(context)}</wa-tab-panel>
			<wa-tab-panel name="tags">${TagsPanel(context)}</wa-tab-panel>
		</wa-tab-group>
	`
})

