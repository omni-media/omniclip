
import {asBindings, type Expression} from "@benev/tact"

// TODO: Restore shortcut descriptions, search, conflict prompts, and reset-all in Tact's UI.

type Modifier = "ctrl" | "meta" | "shift" | "alt"
const key = (code: string, ...mods: Modifier[]): Expression => ["*", ["mod", ...mods], code]
const primary = (code: string, ...mods: Modifier[]): Expression =>
	["max", key(code, "ctrl", ...mods), key(code, "meta", ...mods)]
const tap = (code: string): Expression => ["*", ["mod"], ["taps", 1, 500, code]]
const hold = (code: string): Expression => ["held", 500, key(code)]

export const bindings = asBindings({
	playback: {
		reverse: key("KeyJ"),
		pause: key("KeyK"),
		toggle: key("Space"),
		forward: key("KeyL"),
	},
	editing: {
		undo: primary("KeyZ"),
		redo: primary("KeyZ", "shift"),
		delete: ["max", key("Backspace"), key("Delete")],
		split: primary("KeyB"),
	},
	timeline: {
		previous: key("ArrowLeft"),
		next: key("ArrowRight"),
		zoom_in: ["max", primary("Equal"), primary("NumpadAdd")],
		zoom_out: ["max", primary("Minus"), primary("NumpadSubtract")],
	},
	tools: {
		select: ["max", key("Escape"), key("KeyA")],
		zoom: tap("KeyZ"),
		zoom_hold: hold("KeyZ"),
		blade: tap("KeyB"),
		blade_hold: hold("KeyB"),
		position: tap("KeyP"),
		position_hold: hold("KeyP"),
		hand: tap("KeyH"),
		hand_hold: hold("KeyH"),
	},
})

export type ToolAction = Exclude<keyof typeof bindings.tools, `${string}_hold`>

export const labels = {
	playback: "Playback",
	"playback.reverse": "Play Reverse",
	"playback.pause": "Pause",
	"playback.toggle": "Play / Pause",
	"playback.forward": "Play Forward",
	editing: "Editing",
	"editing.undo": "Undo",
	"editing.redo": "Redo",
	"editing.delete": "Delete Selection",
	"editing.split": "Split at Playhead",
	timeline: "Timeline",
	"timeline.previous": "Previous Frame",
	"timeline.next": "Next Frame",
	"timeline.zoom_in": "Zoom In",
	"timeline.zoom_out": "Zoom Out",
	tools: "Tools",
	"tools.select": "Selection",
	"tools.zoom": "Zoom",
	"tools.zoom_hold": "Zoom (hold)",
	"tools.blade": "Blade",
	"tools.blade_hold": "Blade (hold)",
	"tools.position": "Position",
	"tools.position_hold": "Position (hold)",
	"tools.hand": "Hand",
	"tools.hand_hold": "Hand (hold)",
}

