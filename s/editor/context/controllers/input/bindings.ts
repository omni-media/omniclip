import * as tact from "@benev/tact"

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
		blade_tool: "KeyB",
		blade_tool_temp: ["code", "KeyB", {timing: ["hold", 500]}],
		select_tool: ["or", "Escape", "KeyA"]
	},
})
