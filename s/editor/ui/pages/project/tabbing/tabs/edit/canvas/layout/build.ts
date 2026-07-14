
import {Kind, TimelineFile} from "@omnimedia/omnitool"
import {ms, Ms} from "@omnimedia/omnitool/x/units/ms.js"

import {layoutLeaf} from "./leaf.js"
import {layoutStack} from "./stack.js"
import {layoutSequence} from "./sequence.js"
import type {TimelineCanvas} from "../canvas.js"
import {Index} from "../../../../../../../logic/parts/index.js"
import {LayoutContext, LayoutResult, TimelineNode} from "./types.js"
import {roleIdFromLaneLabel} from "../../../../../../../../context/parts/roles/utils.js"

export function buildLayout(index: Index, canvas: TimelineCanvas): LayoutResult {
	const root = index.getItemMaybe(canvas.viewedItemId())
	if (!root)
		return {clips: [], rows: 1, duration: ms(0)}

	const roleIds = new Map(canvas.deps.session.deps.strata.outliner.state.items
		.map(item => [item.itemId, item.roleId])
	)
	const roleIdFor = (item: TimelineNode) => {
		const itemRoleId = roleIds.get(item.id)
		if (itemRoleId !== undefined)
			return itemRoleId
		// transitions do not have roles so they inherit lane role
		return roleIdFromLaneLabel(index.getParent(item.id)?.label)!
	}

	const resolvedContext: LayoutContext = {
		roleIdFor,
		items: index.items,
		trackY: canvas.trackY,
		selectedItemId: canvas.selectedItemId(),
		timeline: canvas.timeline as TimelineFile,
		pxPerMs: canvas.viewport.durationToWidth(ms(1))
	}

	const walk = (item: TimelineNode, row: number, time: Ms, rootStack = false) => {
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

