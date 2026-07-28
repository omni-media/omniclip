
import {metrics} from '../draw/styles.js'
import type {ClipBox} from './parts/types.js'
import {makeClipBox} from './parts/clip-box.js'
import type {TimelineCanvas} from '../canvas.js'
import {Idx} from '../../../../../../../logic/parts/index.js'

export type {ClipBox}

export function layout(
	canvas: TimelineCanvas,
	parent = canvas.getViewedItem(),
	x = 0,
	y = canvas.trackY(0),
	depth = 0,
): ClipBox[] {
	const isStack = Idx.isStack(parent.kind)

	return parent.childrenIds.flatMap(id => {
		const item = canvas.index.getItem(id)
		const clip = makeClipBox({canvas, x, y, item, depth})

		if (isStack)
			y += clip.height + metrics.trackGap
		else
			x += clip.width

		return Idx.isStruct(item)
			? [clip, ...layout(canvas, item, clip.x, clip.y, depth + 1)]
			: [clip]
	})
}

