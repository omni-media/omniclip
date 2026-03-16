
import {Kind} from "@omnimedia/omnitool"
import {ms, Ms} from "@omnimedia/omnitool/x/units/ms.js"

import {layoutLeaf} from "./leaf.js"
import {layoutStack} from "./stack.js"
import {layoutSequence} from "./sequence.js"
import type {TimelineCanvas} from "../canvas.js"
import {Index} from "../../../../../../../logic/parts/index.js"
import {LayoutContext, LayoutResult, TimelineNode} from "./types.js"

export function buildLayout(index: Index, canvas: TimelineCanvas): LayoutResult {
	const root = index.getItem(canvas.viewedItemId())
	if (!root)
		return {clips: [], rows: 1, duration: ms(0)}

	const resolvedContext: LayoutContext = {
		items: index.items,
		pxPerMs: canvas.viewport.durationToWidth(ms(1)),
		selectedItemId: canvas.selectedItemId(),
		trackY: canvas.trackY,
	}

	const walk = (item: TimelineNode, row: number, time: Ms, rootStack = false): LayoutResult => {
		switch (item.kind) {
			case Kind.Sequence:
				return layoutSequence(resolvedContext, walk, item, row, time)
			case Kind.Stack:
				return layoutStack(resolvedContext, walk, item, row, time, rootStack)
			default:
				return layoutLeaf(resolvedContext, item, row, time)
		}
	}

	return walk(root, 0, ms(0), true)
}

