
import {Index} from "../../../index.js"
import {Id} from "@omnimedia/omnitool"
import {ms, Ms} from "@omnimedia/omnitool/x/units/ms.js"

export interface SnapBounds { start: Ms; end: Ms }

export function snap(x: Ms, threshold: Ms, targets: readonly Ms[]): Ms {
	let nearest: Ms | null = null
	let nearestDiff = Infinity
	for (const target of targets) {
		const diff = Math.abs(target - x)
		if (diff < nearestDiff && diff <= threshold) {
			nearestDiff = diff
			nearest = target
		}
	}
	return nearest ?? x
}

export function getSnapCandidates(targets: readonly Ms[], movingClips: readonly SnapBounds[], anchorStart: Ms): Ms[] {
	const candidates = new Set<Ms>()
	for (const moving of movingClips) {
		const offsetStart = moving.start - anchorStart
		const offsetEnd = moving.end - anchorStart
		for (const target of targets) {
			candidates.add(ms(Math.max(0, target - offsetStart)))
			candidates.add(ms(Math.max(0, target - offsetEnd)))
		}
	}
	return Array.from(candidates).sort((a, b) => a - b)
}

export function getMagneticInsertIndex(clipCenterTime: Ms, siblingCenters: readonly Ms[]): number {
	for (let i = 0; i < siblingCenters.length; i++) {
		if (clipCenterTime < siblingCenters[i]!) return i
	}
	return siblingCenters.length
}

export function getSnapTargets(
	index: Index,
	rootId: Id,
	movingClipIds: Set<Id>,
	playheadTime: Ms
): Ms[] {
	const targets = new Set<Ms>([playheadTime])

	const collect = (id: Id, offset: Ms) => {
		if (movingClipIds.has(id)) return
		const item = index.getItem(id)

		if ('duration' in item) {
			targets.add(offset)
			targets.add(ms(offset + item.duration))
		}

		if ('childrenIds' in item) {
			for (const childId of item.childrenIds) {
				const childStart = index.getItemLaneStart(childId, id)
				collect(childId, ms(offset + childStart))
			}
		}
	}

	collect(rootId, ms(0))
	return Array.from(targets).sort((a, b) => a - b)
}
