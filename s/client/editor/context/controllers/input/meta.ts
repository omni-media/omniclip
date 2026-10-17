
import {Atom} from "@benev/tact"
import {bindings} from "./bindings.js"

export const unassignedBinding = "__omniclip_unassigned__" satisfies Atom

export type TimelineAction = keyof typeof bindings.timeline
export type ShortcutGroupId = "playback" | "timeline" | "editing" | "tools"

export type ShortcutCommand = {
	id: TimelineAction
	name: string
	description?: string
	group: ShortcutGroupId
}
type ShortcutCommandMeta = Omit<ShortcutCommand, "id">

export const shortcutGroups: {id: ShortcutGroupId, label: string}[] = [
	{id: "playback", label: "Playback"},
	{id: "timeline", label: "Timeline"},
	{id: "editing", label: "Editing"},
	{id: "tools", label: "Tools"},
]

const shortcutCommandMeta = {
	undo: {name: "Undo", group: "editing"},
	redo: {name: "Redo", group: "editing"},
	play_reverse: {name: "Play Reverse", group: "playback"},
	pause: {name: "Pause", group: "playback"},
	play_pause: {name: "Play / Pause", group: "playback"},
	play_forward: {name: "Play Forward", group: "playback"},
	step_backward: {name: "Previous Frame", group: "timeline"},
	step_forward: {name: "Next Frame", group: "timeline"},
	delete_clip: {name: "Delete Selection", group: "editing"},
	split_clip: {name: "Split At Playhead", description: "Cut the selected clip at the playhead.", group: "editing"},
	zoom_in: {name: "Zoom In Timeline", group: "timeline"},
	zoom_out: {name: "Zoom Out Timeline", group: "timeline"},
	zoom_tool: {name: "Zoom Tool", group: "tools"},
	zoom_tool_temp: {name: "Zoom Tool Temporary", description: "Hold shortcut to use Zoom, release to return to Select.", group: "tools"},
	blade_tool: {name: "Blade Tool", group: "tools"},
	blade_tool_temp: {name: "Blade Tool Temporary", description: "Hold shortcut to use Blade, release to return to Select.", group: "tools"},
	position_tool: {name: "Position Tool", group: "tools"},
	position_tool_temp: {name: "Position Tool Temporary", description: "Hold shortcut to use Position, release to return to Select.", group: "tools"},
	hand_tool: {name: "Hand Tool", group: "tools"},
	hand_tool_temp: {name: "Hand Tool Temporary", description: "Hold shortcut to use Hand, release to return to Select.", group: "tools"},
	select_tool: {name: "Selection Tool", group: "tools"},
} satisfies Record<TimelineAction, ShortcutCommandMeta>

export const shortcutCommands: ShortcutCommand[] = (Object.keys(bindings.timeline) as TimelineAction[])
	.map(id => ({id, ...shortcutCommandMeta[id]}))

export type TimelineBindings = typeof bindings
export type TimelineBindingAtom = Atom

