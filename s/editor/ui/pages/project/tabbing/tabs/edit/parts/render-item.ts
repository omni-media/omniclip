import {html} from "lit"
import {Content} from "@e280/sly"
import {Item, Kind} from "@omnimedia/omnitool"

import {StackView} from "../views/items/stack/view.js"
import {TimelineText} from "../views/items/text/view.js"
import {TimelineVideo} from "../views/items/video/view.js"
import {TimelineAudio} from "../views/items/audio/view.js"
import {SequenceView} from "../views/items/sequence/view.js"
import {EditorContext} from "../../../../../../../context/context.js"

export function renderItem(context: EditorContext, id: number, ancestors: Item.Any[]): Content {
	const itemsMap = new Map(
		context.strata.timeline.state.items
			.map(item => [item.id, item])
	)

	const item = itemsMap.get(id)

	switch (item?.kind) {
		case Kind.Sequence:
			return SequenceView(context, item as Item.Sequence, ancestors)
		case Kind.Stack:
			return StackView(context, item as Item.Stack, ancestors)
		case Kind.Video:
			return TimelineVideo(context, item, ancestors)
		case Kind.Audio:
			return TimelineAudio(context, item, ancestors)
		case Kind.Text:
			return TimelineText(context, item as Item.Text, ancestors)
		default:
			return html`<div>Unknown Item: ${item?.kind}</div>`
	}

}
