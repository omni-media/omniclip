
import {Id, Kind} from "@omnimedia/omnitool"
import {Ms} from "@omnimedia/omnitool/x/units/ms.js"

export type ClipBox = {
	itemId: Id
	kind: Kind
	label: string
	time: Ms
	duration: Ms
	x: number
	y: number
	width: number
	height: number
}
