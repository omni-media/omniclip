
import {Kind} from "@omnimedia/omnitool"

import {layoutLeaf} from "./leaf.js"
import {LayoutContext, LayoutResult, TimelineNode} from "./types.js"

function resolveDuration(
	context: LayoutContext,
	walk: (item: TimelineNode, row: number, time: number, rootStack?: boolean) => LayoutResult,
	item: TimelineNode
) {
	let duration = item.duration ?? 0

	if (item.childrenIds?.length) {
		for (const id of item.childrenIds) {
			const child = context.items.get(id)
			if (!child)
				continue

			const start = child.start ?? (item.kind === Kind.Sequence ? duration : 0)
			const childLayout = walk(child, 0, start)
			duration = Math.max(duration, childLayout.duration)
		}
	}

	return duration
}

export function layoutStack(
	context: LayoutContext,
	walk: (item: TimelineNode, row: number, time: number, rootStack?: boolean) => LayoutResult,
	item: TimelineNode,
	row: number,
	time: number,
	rootStack = false
): LayoutResult {
	if (!rootStack) {
		const duration = resolveDuration(context, walk, item)
		return layoutLeaf(context, item, row, time, duration, true)
	}

	const clips = []
	let nextRow = row
	let duration = time

	for (const id of item.childrenIds ?? []) {
		const child = context.items.get(id)
		if (!child)
			continue

		const start = child.start ?? 0
		const childLayout = walk(child, nextRow, time + start)
		clips.push(...childLayout.clips)
		nextRow = Math.max(nextRow + 1, childLayout.rows)
		duration = Math.max(duration, childLayout.duration)
	}

	return {
		clips,
		rows: Math.max(row + 1, nextRow),
		duration,
	}
}

