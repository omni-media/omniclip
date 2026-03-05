import {html} from "lit"
import {view} from "@e280/sly"

import styleCss from "./style.css.js"
import {Ruler} from "../ruler/view.js"
import {Playhead} from "../playhead/view.js"
import {renderItem} from "../../parts/render-item.js"
import themeCss from "../../../../../../../../theme.css.js"
import {EditorContext} from "../../../../../../../../context/context.js"

export const TimelineArea = view(use => (context: EditorContext) => {
	use.styles(themeCss, styleCss)
	const core = context.omnicore
	const viewedItemId = core.$viewedItemId.value

	const onScroll = (e: Event) => {
		const element = e.target as HTMLElement
		const scrollLeft = element.scrollLeft
		core.$timeline.scrollLeft.value = scrollLeft
	}

	use.once(async () => {
		await use.rendered
		const timeline = use.shadow.querySelector(".timeline-grid")
		const observer = new ResizeObserver(entries => {
			for (const entry of entries) {
				core.$timeline.width.value = entry.contentRect.width
			}
		})
		observer.observe(timeline!)
	})

	return html`
		<div @scroll=${onScroll} class="timeline-grid">
			<div class="ruler-container">
				${Ruler(context)}
			</div>
			<div class="playhead-container">
				${Playhead(context)}
			</div>
			<div class="content-panel">
				${renderItem(context, viewedItemId, [])}
			</div>
		</div>
	`
})

