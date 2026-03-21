import * as tact from "@benev/tact"

// TODO: FIX TACT, MUTIPLE TIMING BINDS DONT WORK, NO EVENTS HAPPEN
export const bindings = tact.asBindings({
	timeline: {
		play_pause: "Space",
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
		zoom_tool: "KeyZ",
		zoom_tool_temp: ["code", "KeyZ", {timing: ["hold", 500]}],
		blade_tool: "KeyB",
		blade_tool_temp: ["code", "KeyB", {timing: ["hold", 500]}],
		select_tool: ["or", "Escape", "KeyA"]
	},
})
