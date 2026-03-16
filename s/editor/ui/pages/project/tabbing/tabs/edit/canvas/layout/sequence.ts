
import {ms, Ms} from "@omnimedia/omnitool/x/units/ms.js"

import {LayoutContext, LayoutResult, TimelineNode} from "./types.js"

export function layoutSequence(
	context: LayoutContext,
	walk: (item: TimelineNode, row: number, time: Ms, rootStack?: boolean) => LayoutResult,
	item: TimelineNode,
	row: number,
	time: Ms
): LayoutResult {
	const clips = []
	let cursor = ms(0)
	let rows = row + 1
	let duration = time

	for (const id of item.childrenIds ?? []) {
		const child = context.items.get(id)
		if (!child)
			continue

		const childLayout = walk(child, row, ms(time + cursor))
		clips.push(...childLayout.clips)
		cursor = ms(childLayout.duration - time)
		rows = Math.max(rows, childLayout.rows)
		duration = ms(Math.max(duration, childLayout.duration))
	}

	return {clips, rows, duration}
}

