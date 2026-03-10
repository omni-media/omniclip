import {html} from "lit"
import {view} from "@e280/sly"
import {Item, Kind} from "@omnimedia/omnitool"
import {repeat} from "lit/directives/repeat.js"

import styleCss from "./style.css.js"
import themeCss from "../../../../../../../../../../theme.css.js"
import eyeSvg from "../../../../../../../../../icons/gravity-ui/eye.svg.js"
import {EditorContext} from "../../../../../../../../../../context/context.js"
import lockSvg from "../../../../../../../../../icons/gravity-ui/lock.svg.js"

const itemMenu = view(use => (context: EditorContext, item: Item.Any) => {
	use.styles(themeCss, styleCss)

	return html`
		<div class="track-header">
			<span class="label">${item.kind} (${item.id})</span>
			<div class="controls">
				<button title="Toggle Visibility">${eyeSvg}</button>
				<button title="Toggle Lock">${lockSvg}</button>
			</div>
		</div>
	`
})

export function renderItemMenu(context: EditorContext) {
	const viewedItemId = context.session.$viewedItemId.value
	const timeline = context.strata.timeline.state
	const itemsMap = new Map(timeline.items.map(item => [item.id, item]))
	const viewedItem = itemsMap.get(viewedItemId)

	if (viewedItem?.kind === Kind.Stack) {
		return html`
			${repeat(viewedItem.childrenIds, id => id, id => {
				const childItem = itemsMap.get(id)!
				return itemMenu(context, childItem as Item.Any)
			})}
		`
	}

	else {
		return html`
		<div style="display: flex; align-items: center; justify-content: center; height: 60px;">\
			${viewedItem?.kind === Kind.Sequence
			? "Sequence"
			: viewedItem?.kind === Kind.Text
			? "Text"
			: viewedItem?.kind === Kind.Video
			? "Video" : null}
		</div>`
	}
}
