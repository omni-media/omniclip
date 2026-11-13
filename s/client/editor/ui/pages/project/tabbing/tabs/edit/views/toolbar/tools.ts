
import {handTool} from "../../../../../../../logic/parts/modes/hand.js"
import {zoomTool} from "../../../../../../../logic/parts/modes/zoom.js"
import {bladeTool} from "../../../../../../../logic/parts/modes/blade.js"
import {selectTool} from "../../../../../../../logic/parts/modes/select.js"
import {positionTool} from "../../../../../../../logic/parts/modes/position.js"
import type {Tool} from "../../../../../../../logic/parts/modes/tool.js"
import type {ToolAction} from "../../../../../../../../context/controllers/input/bindings.js"

export type ToolOption = {
	id: ToolAction
	label: string
	icon: string
	tool: Tool
}

export const toolOptions: ToolOption[] = [
	{id: "select", label: "Selection", icon: "arrow-pointer", tool: selectTool},
	{id: "position", label: "Position", icon: "up-down-left-right", tool: positionTool},
	{id: "blade", label: "Blade", icon: "scissors", tool: bladeTool},
	{id: "hand", label: "Hand", icon: "hand", tool: handTool},
	{id: "zoom", label: "Zoom", icon: "magnifying-glass-plus", tool: zoomTool},
]

