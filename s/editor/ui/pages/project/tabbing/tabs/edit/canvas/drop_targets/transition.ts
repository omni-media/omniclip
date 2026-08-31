
import {Kind} from "@omnimedia/omnitool"

import {Idx} from "../../../../../../../logic/parts/index.js"
import {edgeOf} from "../../../../../../../logic/parts/interactions/drag/parts/snapshot.js"
import type {DropIntent} from "../../../../../../../logic/parts/interactions/drag/parts/intent.js"
import type {TimelineCanvas} from "../canvas.js"

export function transitionDropTargets(canvas: TimelineCanvas): DropIntent[] {
	return canvas.clips.flatMap(clip => {
		const item = canvas.index.getItem(clip.itemId)
		const parent = canvas.index.getParent(item.id)
		if (parent?.kind !== Kind.Sequence)
			return []
		if (Idx.isTransition(item))
			return [{targetId: item.id, edge: "right" as const, indicator: clip}]

		const index = parent.childrenIds.indexOf(item.id)
		const next = canvas.index.getItemMaybe(parent.childrenIds[index + 1])
		return canvas.deps.session.isVisualItem(item) && canvas.deps.session.isVisualItem(next)
			? [{targetId: next.id, edge: "right" as const, indicator: edgeOf(clip, "right")}]
			: []
	})
}

