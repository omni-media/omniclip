import * as tact from "@benev/tact"

export const bindings = tact.asBindings({
	timeline: {
		play_pause: "Space",
		split_clip: [
			"or",
			["mods", "KeyB", {ctrl: true}],
			["mods", "KeyB", {meta: true}]
		],
		blade_tool: "KeyB",
		blade_tool_temp: ["code", "KeyB", {timing: ["hold", 500]}],
		select_tool: ["or", "Escape", "KeyA"]
	},
})
