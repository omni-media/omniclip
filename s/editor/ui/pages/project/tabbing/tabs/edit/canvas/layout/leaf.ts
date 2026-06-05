
import {ms, Ms} from "@omnimedia/omnitool/x/units/ms.js"

import {metrics} from "../draw/styles.js"
import {TimelineClipBox} from "../draw/clip.js"
import {LayoutContext, LayoutResult, TimelineNode} from "./types.js"

const MIN_CLIP_DURATION = 1

export function layoutLeaf(
	context: LayoutContext,
	item: TimelineNode,
	row: number,
	time: Ms,
	duration = ms(item.duration ?? 0),
	enterable = false
): LayoutResult {
	const clip: TimelineClipBox = {
		itemId: item.id,
		kind: item.kind,
		label: item.name ?? item.id.toString(),
		x: time * context.pxPerMs + metrics.paddingX,
		y: context.trackY(row),
		width: Math.max(MIN_CLIP_DURATION, duration * context.pxPerMs),
		height: metrics.trackHeight,
		selected: context.selectedItemId === item.id,
		enterable,
	}

	return {clips: [clip], rows: row + 1, duration: ms(time + duration)}
}

