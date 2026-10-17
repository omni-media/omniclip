
import {Id, Kind, Ms} from "@omnimedia/omnitool"

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
