
import {metrics} from '../draw/styles.js'
import type {ClipBox} from './parts/types.js'
import {makeClipBox} from './parts/clip-box.js'
import type {TimelineCanvas} from '../canvas.js'
import {Idx, type Index} from '../../../../../../../logic/parts/index.js'

export type {ClipBox}

export function layout(index: Index, canvas: TimelineCanvas): ClipBox[] {
  const root = canvas.getViewedItem()
  const isStack = Idx.isStack(root.kind)

  let y = canvas.trackY(0)

  return root.childrenIds.map(id => {
    const clip = makeClipBox(canvas, {
			y,
			rootId: root.id,
      item: index.getItem(id)
    })

	if (isStack)
			y += clip.height + metrics.trackGap

		return clip
	})
}

