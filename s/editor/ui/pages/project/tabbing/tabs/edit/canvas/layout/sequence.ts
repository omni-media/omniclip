
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

		const start = child.start ?? cursor
		const childLayout = walk(child, row, time + start)
		clips.push(...childLayout.clips)
		cursor = Math.max(cursor, start + (childLayout.duration - (time + start)))
		rows = Math.max(rows, childLayout.rows)
		duration = Math.max(duration, childLayout.duration)
	}

	return {clips, rows, duration}
}

