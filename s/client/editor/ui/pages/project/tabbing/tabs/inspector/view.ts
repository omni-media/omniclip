import {html} from "lit"
import {shadow, useCss} from "@e280/sly"
import {Item, Kind} from "@omnimedia/omnitool"

import styleCss from "./style.css.js"
import themeCss from "../../../../../../theme.css.js"
import {TagControls} from "./views/controls/tags/view.js"
import {VideoControls} from "./views/controls/video.js"
import {AudioControls} from "./views/controls/audio.js"
import {ImageControls} from "./views/controls/image.js"
import {TextControls} from "./views/controls/text/view.js"
import type {Idx} from "../../../../../logic/parts/index.js"
import {StructureControls} from "./views/controls/structure/view.js"
import {EditorContext} from "../../../../../../context/context.js"

export const InspectorTab = shadow((context: EditorContext) => {
	useCss(themeCss, styleCss)
	const session = context.session

	const selectedItemId = session.$selectedItem()
	const selectedItem = session.index.getItemMaybe(selectedItemId)
	const canTag = selectedItem && ![Kind.Gap, Kind.Transition].includes(selectedItem.kind)

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
			case Kind.Sequence:
			case Kind.Stack:
				return StructureControls(context, selectedItem as Item.Sequence | Item.Stack)
			default:
				return html`<div class="placeholder">Select an item to inspect its properties.</div>`
		}
	})()

	return html`
		${controls}
		${canTag ? TagControls(context, selectedItem.id) : ""}
	`
})
