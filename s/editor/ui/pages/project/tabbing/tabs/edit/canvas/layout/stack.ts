
import {ms, Ms} from "@omnimedia/omnitool/x/units/ms.js"
import {computeItemDuration} from "@omnimedia/omnitool/x/timeline/renderers/parts/handy.js"

import {layoutLeaf} from "./leaf.js"
import {LayoutContext, LayoutResult, TimelineNode} from "./types.js"

export function layoutStack(
	context: LayoutContext,
	walk: (item: TimelineNode, row: number, time: Ms, rootStack?: boolean) => LayoutResult,
	item: TimelineNode,
	row: number,
	time: Ms,
	rootStack = false
): LayoutResult {
	if (!rootStack) {
		const duration = computeItemDuration(item.id, context.timeline)
		return layoutLeaf(context, item, row, time, duration, true)
	}

	const clips = []
	let nextRow = row
	let duration = time

	for (const id of item.childrenIds ?? []) {
		const child = context.items.get(id)
		if (!child)
			continue

		const childLayout = walk(child, nextRow, time)
		clips.push(...childLayout.clips)
		nextRow = Math.max(nextRow + 1, childLayout.rows)
		duration = ms(Math.max(duration, childLayout.duration))
	}

	return {
		clips,
		rows: Math.max(row + 1, nextRow),
		duration,
	}
}
