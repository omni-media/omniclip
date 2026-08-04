
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
		const children = Idx.isStruct(item) ? layout(canvas, item, x, y, depth + 1) : []

		if (children.length)
			clip.height = Math.max(...children.map(child => child.y + child.height)) - y

		if (isStack)
			y += clip.height + metrics.trackGap
		else
			x += clip.width

		return [clip, ...children]
	})
}

