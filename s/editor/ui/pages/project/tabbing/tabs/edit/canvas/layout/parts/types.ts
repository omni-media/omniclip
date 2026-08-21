
import {Id, Kind} from "@omnimedia/omnitool"
import {Ms} from "@omnimedia/omnitool/x/units/ms.js"

export type ClipBox = {
	itemId: Id
	depth: number
	kind: Kind
	label: string
	start: Ms
	duration: Ms
	x: number
	y: number
	width: number
	height: number
}
