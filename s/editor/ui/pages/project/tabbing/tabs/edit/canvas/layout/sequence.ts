
import {LayoutContext, LayoutResult, TimelineNode} from "./types.js"

export function layoutSequence(
	context: LayoutContext,
	walk: (item: TimelineNode, row: number, time: number, rootStack?: boolean) => LayoutResult,
	item: TimelineNode,
	row: number,
	time: number
): LayoutResult {
	const clips = []
	let cursor = 0
	let rows = row + 1
	let duration = time

	for (const id of item.childrenIds ?? []) {
		const child = context.items.get(id)
		if (!child)
			continue

		const childLayout = walk(child, row, time + cursor)
		clips.push(...childLayout.clips)
		cursor += childLayout.duration - (time + cursor)
		rows = Math.max(rows, childLayout.rows)
		duration = Math.max(duration, childLayout.duration)
	}

	return {clips, rows, duration}
}

