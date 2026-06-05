
import {Item, Resource} from "@omnimedia/omnitool"
import {Ms, ms} from "@omnimedia/omnitool/x/units/ms.js"

import {trim} from "./action.js"
import {Idx} from "../../../index.js"
import {TrimEdge} from "../trimmer.js"
import {OmniSession} from "../../../../session.js"

export function trimTransition(
	item: Item.Transition,
	edge: TrimEdge,
	time: Ms,
	laneStart: Ms,
	prev: Idx.Clip | undefined,
	next: Idx.Clip | undefined,
	session: OmniSession,
) {
	const newDuration = Math.max(1, edge === "start" ? item.duration + laneStart - time : time - laneStart)
	return resizeTransition(item, newDuration, prev, next, session.deps.resolveMedia)
}

export function resizeTransition(
	item: Item.Transition,
	newDuration: number,
	prev: Idx.Clip | undefined,
	next: Idx.Clip | undefined,
	resolveMedia: (item: Item.Any) => Resource.Media | null,
) {
	const halfDelta = ms((newDuration - item.duration) / 2)
	const overlay = new Map<number, Item.Any>()
	let duration = item.duration

	const absorb = (clip: Idx.Clip | undefined, edge: TrimEdge, offset: Ms) => {
		if (!clip) return
		const patched = trim(clip, edge, offset, resolveMedia(clip)?.duration)
		duration += clip.duration - patched.duration
		overlay.set(clip.id, patched)
	}

	if (prev)
		absorb(prev, "end", ms(prev.duration - halfDelta))
	absorb(next, "start", halfDelta)
	overlay.set(item.id, {...item, duration})
	return overlay
}

