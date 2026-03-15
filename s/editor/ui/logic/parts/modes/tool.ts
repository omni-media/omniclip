
import {Ms} from "@omnimedia/omnitool/x/units/ms.js"

import {OmniSession} from "../../session.js"
import {TimelineClipBox} from "../../../pages/project/tabbing/tabs/edit/canvas/draw/clip.js"

export type ToolName = "select" | "blade" | "trim" | "position" | "zoom"

export type ToolEvent = {
	event: PointerEvent
	time: Ms
	clip: TimelineClipBox | null
	point: {x: number, y: number}
	inRuler: boolean
}

export type ToolHandlers = {
	pointerdown?: (e: ToolEvent) => void
	pointermove?: (e: ToolEvent) => void
	pointerup?: (e: ToolEvent) => void
	pointerleave?: (e: ToolEvent) => void
	doubleclick?: (e: ToolEvent) => void
}

export type ActiveTool = ToolHandlers & {id: ToolName}

export type Tool = (session: OmniSession) => ActiveTool

export function tool(id: ToolName, setup: (session: OmniSession) => ToolHandlers): Tool {
	return (session) => ({
		id,
		...setup(session)
	})
}
