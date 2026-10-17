
import {handTool} from "../../../../../../../logic/parts/modes/hand.js"
import {zoomTool} from "../../../../../../../logic/parts/modes/zoom.js"
import {bladeTool} from "../../../../../../../logic/parts/modes/blade.js"
import {selectTool} from "../../../../../../../logic/parts/modes/select.js"
import {positionTool} from "../../../../../../../logic/parts/modes/position.js"
import type {Tool, ToolName} from "../../../../../../../logic/parts/modes/tool.js"
import type {TimelineAction} from "../../../../../../../../context/controllers/input/meta.js"

export type ToolOption = {
	id: ToolName
	label: string
	icon: string
	shortcut: TimelineAction
	tool: Tool
}

export const toolOptions: ToolOption[] = [
	{id: "select", label: "Selection", icon: "arrow-pointer", shortcut: "select_tool", tool: selectTool},
	{id: "position", label: "Position", icon: "up-down-left-right", shortcut: "position_tool", tool: positionTool},
	{id: "blade", label: "Blade", icon: "scissors", shortcut: "blade_tool", tool: bladeTool},
	{id: "hand", label: "Hand", icon: "hand", shortcut: "hand_tool", tool: handTool},
	{id: "zoom", label: "Zoom", icon: "magnifying-glass-plus", shortcut: "zoom_tool", tool: zoomTool},
]

