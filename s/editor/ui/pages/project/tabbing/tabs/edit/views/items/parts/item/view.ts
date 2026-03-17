import {view} from "@e280/sly"
import {html, TemplateResult} from "lit"
import {Item} from "@omnimedia/omnitool"
import {ms} from "@omnimedia/omnitool/x/units/ms.js"

import styleCss from "./style.css.js"
import {DirectiveResult} from "lit/directive.js"
import themeCss from "../../../../../../../../../../theme.css.js"
import {EditorContext} from "../../../../../../../../../../context/context.js"


export const TimelineItem = view(use => (
	context: EditorContext,
	item: Item.Video | Item.Text | Item.Audio,
	content: TemplateResult | DirectiveResult,
	ancestors: Item.Any[]
) => {
	use.styles(themeCss, styleCss)
	const session = context.session

	const visualWidth = session.viewport.durationToWidth(ms(item.duration ?? 0))
	const setViewedItem = () => session.$viewedItemId.value = item.id
	const setSelectedItem = () => session.$selectedItem.value = item.id

	return html`
		<div
			@dblclick=${setViewedItem}
			class="item ${item.kind}"
			?data-selected=${""}
			@click=${setSelectedItem}
			style="width: ${visualWidth}px;"
		>
			<span class=name>${"file name.mp4"}</span>
			${content}
			<div class="resize-handle start"></div>
			<div class="resize-handle end"></div>
		</div>
	`
})

