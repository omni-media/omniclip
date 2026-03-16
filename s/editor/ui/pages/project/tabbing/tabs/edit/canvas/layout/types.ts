
import {Kind} from "@omnimedia/omnitool"
import {Ms} from "@omnimedia/omnitool/x/units/ms.js"

import {TimelineClipBox} from "../draw/clip.js"

export type TimelineNode = {
	id: number
	kind: Kind
	duration?: number
	start?: number
	childrenIds?: readonly number[]
}

export type LayoutResult = {
	clips: TimelineClipBox[]
	rows: number
	duration: Ms
}

export type LayoutContext = {
	items: Map<number, TimelineNode>
	pxPerMs: number
	selectedItemId: number | null
	trackY: (row: number) => number
}

