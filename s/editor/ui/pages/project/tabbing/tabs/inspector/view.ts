import {html} from "lit"
import {shadow, useCss} from "@e280/sly"
import {Item, Kind} from "@omnimedia/omnitool"

import styleCss from "./style.css.js"
import {VideoControls} from "./views/controls/video.js"
import {AudioControls} from "./views/controls/audio.js"
import {ImageControls} from "./views/controls/image.js"
import {TextControls} from "./views/controls/text/view.js"
import themeCss from "./../../../../../../theme.css.js"
import {EditorContext} from "./../../../../../../context/context.js"
import type {Idx} from "../../../../../logic/parts/index.js"

export const InspectorTab = shadow((context: EditorContext) => {
	useCss(themeCss, styleCss)
	const session = context.session

	const selectedItemId = session.$selectedItem.value
	const selectedItem = session.index.getItemMaybe(selectedItemId)

	const controls = (() => {
		switch(selectedItem?.kind) {
			case Kind.Video:
				return VideoControls(context, selectedItem as Item.Video)
			case Kind.Clip:
				return VideoControls(context, selectedItem as Idx.VideoItem)
			case Kind.Image:
				return ImageControls(context, selectedItem as Item.Image)
			case Kind.Audio:
				return AudioControls(context, selectedItem as Item.Audio)
			case Kind.Text:
				return TextControls(context, selectedItem as Item.Text)
			default:
				return html`<div class="placeholder">Select an item to inspect its properties.</div>`
		}
	})()

	return html`
		<div class="inspector">
			<div class="panel-content">
				${controls}
			</div>
		</div>
	`
})
