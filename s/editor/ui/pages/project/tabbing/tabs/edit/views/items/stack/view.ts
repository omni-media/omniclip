import {html} from "lit"
import {view} from "@e280/sly"
import {Item, Kind} from "@omnimedia/omnitool"

import styleCss from "./style.css.js"
import {renderItem} from "../../../parts/render-item.js"
import {PIXELS_PER_MILLISECOND} from "../../../constants.js"
import themeCss from "../../../../../../../../../theme.css.js"
import {EditorContext} from "../../../../../../../../../context/context.js"

export const StackView = view(use => (
	context: EditorContext,
	item: Item.Stack,
	ancestors: Item.Any[]
) => {
	use.styles(themeCss, styleCss)
	const session = context.session
	const timeline = context.strata.timeline.state.timeline

	const getStackDuration = (item: Item.Stack, items: Item.Any[]) => {
		return Math.max(0, ...item.childrenIds.map(id => {
			const child = items.find(item => item.id === id)
			if(child?.kind === Kind.Video)
				return child?.duration
			else return 0
		}))
	}

	const setViewedItem = async () => session.$viewedItemId.value = item.id

	const renderFullMode = () => {
		return html`
			<div class="stack-tracks">
			${item.childrenIds.map(childId => html`
				<div class=stack-track>
					${renderItem(context, childId, [...ancestors, item])}
				</div>
			`)}
			</div>
		`
	}

	const renderCompactMode = () => {
		const zoom = session.$zoom.value
		const stackDuration = getStackDuration(item, timeline.items as Item.Any[])
		const visualWidth = stackDuration * PIXELS_PER_MILLISECOND * zoom

		return html`
			<div
				class="stack-block"
				style="
					height: 60px;
					width: ${visualWidth}px;
				"
				@dblclick=${setViewedItem}
				title="Explore Stack"
			>
				<span class="label">Stack (${item.id})</span>
			</div>
		`
	}

	if (ancestors.length === 0) {
		return renderFullMode()
	} else {
		return renderCompactMode()
	}
})
