import {html} from "lit"
import {shadow, useCss, useSignal} from "@e280/sly"
import {Item, Kind} from "@omnimedia/omnitool"

import styleCss from "./style.css.js"
import {InfoControls} from "./views/controls/info.js"
import {VideoControls} from "./views/controls/video.js"
import {AudioControls} from "./views/controls/audio.js"
import {TextControls} from "./views/controls/text/view.js"
import themeCss from "./../../../../../../theme.css.js"
import textSvg from "./../../../../../icons/gravity-ui/text.svg.js"
import {EditorContext} from "./../../../../../../context/context.js"
import circleInfoSvg from "./../../../../../icons/gravity-ui/circle-info.svg.js"
import videoPlayerSvg from "./../../../../../icons/carbon-icons/video-player.svg.js"
import audioWaveSvg from "./../../../../../icons/material-design-icons/audio-wave.svg.js"

type Tab = {
	id: string
	icon: any
	label: string
	component: (context: EditorContext, item: Item.Any) => any
}

const TABS: {[key: string]: Tab} = {
	INFO: {id: "info", icon: circleInfoSvg, label: "Info", component: InfoControls},
	VIDEO: {id: "video", icon: videoPlayerSvg, label: "Video", component: (c, i) => VideoControls(c, i as Item.Video)},
	AUDIO: {id: "audio", icon: audioWaveSvg, label: "Audio", component: AudioControls},
	TEXT: {id: "text", icon: textSvg, label: "Text", component: (c, i) => TextControls(c, i as Item.Text)},
}

export const InspectorTab = shadow((context: EditorContext) => {
	useCss(themeCss, styleCss)
	const session = context.session

	const selectedItemId = session.$selectedItem.value
	const timeline = context.strata.timeline.state
	const selectedItem = timeline.items.find(item => item.id === selectedItemId)
	const activeTabId = useSignal(TABS.VIDEO.id)

	// if (!selectedItem) {
	// 	return html`<div class="placeholder">Select an item to inspect its properties.</div>`
	// }

	const availableTabs = (() => {
		const tabs = [TABS.TEXT]
		switch(selectedItem?.kind as Kind) {
			case Kind.Video:
				return [...tabs, TABS.VIDEO, TABS.AUDIO]
			case Kind.Audio:
				return [...tabs, TABS.AUDIO]
			case Kind.Text:
				return tabs
			default:
				return tabs
		}
	})()

	const activeTab = availableTabs.find(t => t.id === activeTabId.value) ?? availableTabs[0]

	return html`
		<div class="inspector">
			<div class="tab-bar">
				${availableTabs.map(tab => html`
					<button
						class="tab-button"
						?data-active=${tab.id === activeTab.id}
						@click=${() => activeTabId.value = tab.id}
						title=${tab.label}
					>
						${tab.icon}
					</button>
				`)}
			</div>
			<div class="panel-content">
				${activeTab.component(context, selectedItem as Item.Any)}
			</div>
		</div>
	`
})
