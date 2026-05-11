import * as tact from "@benev/tact"

// TODO: FIX TACT, MUTIPLE TIMING BINDS DONT WORK, NO EVENTS HAPPEN
export const bindings = tact.asBindings({
	timeline: {
		undo: [
			"or",
			["mods", "KeyZ", {ctrl: true}],
			["mods", "KeyZ", {meta: true}],
		],
		redo: [
			"or",
			["mods", "KeyZ", {ctrl: true, shift: true}],
			["mods", "KeyZ", {meta: true, shift: true}],
		],
		play_pause: "Space",
		step_backward: "ArrowLeft",
		step_forward: "ArrowRight",
		delete_clip: ["or", "Backspace", "Delete"],
		split_clip: [
			"or",
			["mods", "KeyB", {ctrl: true}],
			["mods", "KeyB", {meta: true}]
		],
		zoom_in: [
			"or",
			["mods", "Equal", {ctrl: true}],
			["mods", "Equal", {meta: true}],
			["mods", "NumpadAdd", {ctrl: true}],
			["mods", "NumpadAdd", {meta: true}]
		],
		zoom_out: [
			"or",
			["mods", "Minus", {ctrl: true}],
			["mods", "Minus", {meta: true}],
			["mods", "NumpadSubtract", {ctrl: true}],
			["mods", "NumpadSubtract", {meta: true}]
		],
		zoom_tool: ["mods", "KeyZ", {}],
		zoom_tool_temp: ["mods", ["code", "KeyZ", {timing: ["hold", 500]}], {}],
		blade_tool: ["mods", "KeyB", {}],
		blade_tool_temp: ["mods", ["code", "KeyB", {timing: ["hold", 500]}], {}],
		position_tool: ["mods", "KeyH", {}],
		position_tool_temp: ["mods", ["code", "KeyH", {timing: ["hold", 500]}], {}],
		select_tool: ["or", "Escape", ["mods", "KeyA", {}]]
	},
})
