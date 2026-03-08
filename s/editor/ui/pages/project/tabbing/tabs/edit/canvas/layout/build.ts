
import {Kind} from "@omnimedia/omnitool"

import {layoutLeaf} from "./leaf.js"
import {layoutStack} from "./stack.js"
import {layoutSequence} from "./sequence.js"
import type {TimelineCanvas} from "../canvas.js"
import {LayoutContext, LayoutResult, TimelineNode} from "./types.js"

export function buildLayout(canvas: TimelineCanvas): LayoutResult {
	const timelineItems = canvas.timeline.items
	const items = new Map<number, TimelineNode>(
		timelineItems.map(item => {
			const node = item as TimelineNode
			return [node.id, node]
		})
	)

	const root = items.get(canvas.viewedItemId())
	if (!root)
		return {clips: [], rows: 1, duration: 0}

	const resolvedContext: LayoutContext = {
		items,
		pxPerMs: canvas.pxPerMs(),
		selectedItemId: canvas.selectedItemId(),
		trackY: canvas.trackY,
	}

	const walk = (item: TimelineNode, row: number, time: number, rootStack = false): LayoutResult => {
		switch (item.kind) {
			case Kind.Sequence:
				return layoutSequence(resolvedContext, walk, item, row, time)
			case Kind.Stack:
				return layoutStack(resolvedContext, walk, item, row, time, rootStack)
			default:
				return layoutLeaf(resolvedContext, item, row, time)
		}
	}

	return walk(root, 0, 0, true)
}

