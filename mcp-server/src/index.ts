#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
	type Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { BrowserBridge } from "./bridge.js";

const WS_PORT = 9876;
const bridge = new BrowserBridge(WS_PORT);

// ─── Tool Definitions ────────────────────────────────────────────────

const tools: Tool[] = [
	// ── Query Tools ──────────────────────────────────────────────────
	{
		name: "get_timeline_state",
		description:
			"Get the complete timeline state including all effects, tracks, filters, animations, transitions, and current playback position. Call this before making changes to understand the current project state.",
		inputSchema: {
			type: "object" as const,
			properties: {},
			required: [],
		},
	},
	{
		name: "get_project_info",
		description:
			"Get project metadata: name, ID, resolution, aspect ratio, standard, bitrate, and timeline statistics (number of effects, tracks, total duration).",
		inputSchema: {
			type: "object" as const,
			properties: {},
			required: [],
		},
	},
	{
		name: "get_effects",
		description:
			"Get all effects on the timeline, optionally filtered by kind (video/audio/image/text) or track number.",
		inputSchema: {
			type: "object" as const,
			properties: {
				kind: {
					type: "string",
					enum: ["video", "audio", "image", "text"],
					description: "Filter by effect kind",
				},
				track: {
					type: "number",
					description: "Filter by track number (0-based)",
				},
			},
			required: [],
		},
	},
	{
		name: "get_tracks",
		description: "Get all tracks with their id, locked, visible, and muted status.",
		inputSchema: {
			type: "object" as const,
			properties: {},
			required: [],
		},
	},
	{
		name: "list_available_filters",
		description:
			"List all available filter types (e.g., BlurFilter, GrayscaleFilter, AdjustmentFilter) that can be applied to video and image effects.",
		inputSchema: {
			type: "object" as const,
			properties: {},
			required: [],
		},
	},
	{
		name: "list_available_animations",
		description:
			"List all available animation types for effects (e.g., fade-in, slide-out, spin-in, zoom-out, etc.).",
		inputSchema: {
			type: "object" as const,
			properties: {},
			required: [],
		},
	},
	{
		name: "list_available_transitions",
		description:
			"List all available GL transition types that can be applied between two adjacent video/image effects on the same track.",
		inputSchema: {
			type: "object" as const,
			properties: {},
			required: [],
		},
	},

	// ── Effect CRUD ──────────────────────────────────────────────────
	{
		name: "add_text_effect",
		description:
			"Add a new text effect to the timeline. Text appears as an overlay on the video canvas. If start_at_position and track are not specified, the effect is placed automatically at the first available position.",
		inputSchema: {
			type: "object" as const,
			properties: {
				text: { type: "string", description: "The text content to display" },
				start_at_position: {
					type: "number",
					description: "Start position on the timeline in milliseconds. Auto-placed if omitted.",
				},
				duration: {
					type: "number",
					description: "Duration in milliseconds (default: 5000)",
				},
				track: {
					type: "number",
					description: "Track number (0-based). Auto-placed if omitted.",
				},
				fontSize: { type: "number", description: "Font size in pixels (default: 38)" },
				fontFamily: { type: "string", description: "Font family name (default: 'Arial')" },
				fontWeight: {
					type: "string",
					enum: ["normal", "bold", "bolder", "lighter", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
					description: "Font weight (default: 'normal')",
				},
				fontStyle: {
					type: "string",
					enum: ["normal", "italic", "oblique"],
					description: "Font style (default: 'normal')",
				},
				align: {
					type: "string",
					enum: ["left", "right", "center", "justify"],
					description: "Text alignment (default: 'center')",
				},
				fill: {
					type: "array",
					items: { type: "string" },
					description: "Array of fill colors as hex strings (default: ['#FFFFFF'])",
				},
				position: {
					type: "object",
					properties: { x: { type: "number" }, y: { type: "number" } },
					description: "Position on canvas {x, y}. Defaults to center.",
				},
				rotation: { type: "number", description: "Rotation in degrees (default: 0)" },
				scale: {
					type: "object",
					properties: { x: { type: "number" }, y: { type: "number" } },
					description: "Scale {x, y} (default: {x:1, y:1})",
				},
			},
			required: ["text"],
		},
	},
	{
		name: "remove_effect",
		description:
			"Remove an effect from the timeline by its ID. Also removes associated animations, transitions, and filters.",
		inputSchema: {
			type: "object" as const,
			properties: {
				effect_id: { type: "string", description: "The ID of the effect to remove" },
			},
			required: ["effect_id"],
		},
	},
	{
		name: "remove_all_effects",
		description: "Remove all effects from the timeline. This clears the entire project timeline.",
		inputSchema: {
			type: "object" as const,
			properties: {},
			required: [],
		},
	},

	// ── Effect Positioning ───────────────────────────────────────────
	{
		name: "set_effect_timing",
		description:
			"Set the timing properties of an effect: its position on the timeline, duration, start/end trim points, and track assignment. Only provided properties are updated.",
		inputSchema: {
			type: "object" as const,
			properties: {
				effect_id: { type: "string", description: "The ID of the effect to modify" },
				start_at_position: { type: "number", description: "Position on timeline in milliseconds" },
				duration: { type: "number", description: "Duration in milliseconds" },
				start: { type: "number", description: "Trim start point in ms (within source media)" },
				end: { type: "number", description: "Trim end point in ms (within source media)" },
				track: { type: "number", description: "Track number (0-based)" },
			},
			required: ["effect_id"],
		},
	},
	{
		name: "set_effect_position_on_canvas",
		description: "Set the position of a visual effect (video/image/text) on the canvas.",
		inputSchema: {
			type: "object" as const,
			properties: {
				effect_id: { type: "string", description: "The ID of the effect" },
				x: { type: "number", description: "X coordinate on canvas" },
				y: { type: "number", description: "Y coordinate on canvas" },
			},
			required: ["effect_id", "x", "y"],
		},
	},
	{
		name: "rotate_effect",
		description: "Set the rotation angle of a visual effect (video/image/text) on the canvas.",
		inputSchema: {
			type: "object" as const,
			properties: {
				effect_id: { type: "string", description: "The ID of the effect" },
				rotation: { type: "number", description: "Rotation angle in degrees" },
			},
			required: ["effect_id", "rotation"],
		},
	},
	{
		name: "scale_effect",
		description: "Set the scale of a visual effect (video/image/text) on the canvas.",
		inputSchema: {
			type: "object" as const,
			properties: {
				effect_id: { type: "string", description: "The ID of the effect" },
				scaleX: { type: "number", description: "Horizontal scale factor (1.0 = 100%)" },
				scaleY: { type: "number", description: "Vertical scale factor (1.0 = 100%)" },
			},
			required: ["effect_id", "scaleX", "scaleY"],
		},
	},
	{
		name: "resize_effect",
		description: "Set the width and/or height of a visual effect (video/image/text).",
		inputSchema: {
			type: "object" as const,
			properties: {
				effect_id: { type: "string", description: "The ID of the effect" },
				width: { type: "number", description: "Width in pixels" },
				height: { type: "number", description: "Height in pixels" },
			},
			required: ["effect_id"],
		},
	},

	// ── Text Styling ─────────────────────────────────────────────────
	{
		name: "set_text_properties",
		description:
			"Set one or more style properties on a text effect. All properties are optional — only provided ones are updated.",
		inputSchema: {
			type: "object" as const,
			properties: {
				effect_id: { type: "string", description: "The ID of the text effect to style" },
				text: { type: "string", description: "Text content" },
				fontSize: { type: "number", description: "Font size in pixels" },
				fontFamily: { type: "string", description: "Font family name" },
				fontWeight: {
					type: "string",
					enum: ["normal", "bold", "bolder", "lighter", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
				},
				fontStyle: { type: "string", enum: ["normal", "italic", "oblique"] },
				fontVariant: { type: "string", enum: ["normal", "small-caps"] },
				align: { type: "string", enum: ["left", "right", "center", "justify"] },
				fill: {
					type: "array",
					items: { type: "string" },
					description: "Array of fill color hex strings",
				},
				fillGradientType: {
					type: "number",
					enum: [0, 1],
					description: "0 = LINEAR_VERTICAL, 1 = LINEAR_HORIZONTAL",
				},
				fillGradientStops: {
					type: "array",
					items: { type: "number" },
					description: "Gradient stop positions (0-1)",
				},
				stroke: { type: "string", description: "Stroke color hex string" },
				strokeThickness: { type: "number", description: "Stroke thickness in pixels" },
				lineJoin: { type: "string", enum: ["miter", "round", "bevel"] },
				miterLimit: { type: "number" },
				letterSpacing: { type: "number" },
				textBaseline: {
					type: "string",
					enum: ["alphabetic", "bottom", "middle", "top", "hanging"],
				},
				dropShadow: { type: "boolean", description: "Enable/disable drop shadow" },
				dropShadowColor: { type: "string", description: "Drop shadow color hex" },
				dropShadowAlpha: { type: "number", description: "Drop shadow alpha (0-1)" },
				dropShadowAngle: { type: "number", description: "Drop shadow angle in radians" },
				dropShadowBlur: { type: "number", description: "Drop shadow blur radius" },
				dropShadowDistance: { type: "number", description: "Drop shadow distance" },
				wordWrap: { type: "boolean" },
				wordWrapWidth: { type: "number" },
				breakWords: { type: "boolean" },
				lineHeight: { type: "number" },
				leading: { type: "number" },
				whiteSpace: { type: "string", enum: ["pre", "normal", "pre-line"] },
			},
			required: ["effect_id"],
		},
	},

	// ── Track Management ─────────────────────────────────────────────
	{
		name: "add_track",
		description: "Add a new empty track to the timeline.",
		inputSchema: {
			type: "object" as const,
			properties: {},
			required: [],
		},
	},
	{
		name: "remove_track",
		description: "Remove a track from the timeline by its ID.",
		inputSchema: {
			type: "object" as const,
			properties: {
				track_id: { type: "string", description: "The ID of the track to remove" },
			},
			required: ["track_id"],
		},
	},
	{
		name: "toggle_track_muted",
		description: "Toggle the muted state of a track (mutes/unmutes audio from this track).",
		inputSchema: {
			type: "object" as const,
			properties: {
				track_id: { type: "string", description: "The ID of the track" },
			},
			required: ["track_id"],
		},
	},
	{
		name: "toggle_track_visibility",
		description: "Toggle the visibility of a track (hides/shows all effects on this track).",
		inputSchema: {
			type: "object" as const,
			properties: {
				track_id: { type: "string", description: "The ID of the track" },
			},
			required: ["track_id"],
		},
	},
	{
		name: "toggle_track_locked",
		description: "Toggle the locked state of a track (prevents/allows editing of effects on this track).",
		inputSchema: {
			type: "object" as const,
			properties: {
				track_id: { type: "string", description: "The ID of the track" },
			},
			required: ["track_id"],
		},
	},

	// ── Transitions ──────────────────────────────────────────────────
	{
		name: "add_transition",
		description:
			"Add a GL transition between two adjacent video/image effects on the same track. The outgoing effect must end exactly where the incoming effect begins (they must be touching).",
		inputSchema: {
			type: "object" as const,
			properties: {
				outgoing_effect_id: { type: "string", description: "ID of the outgoing (left) effect" },
				incoming_effect_id: { type: "string", description: "ID of the incoming (right) effect" },
				transition_name: {
					type: "string",
					description: "Name of the GL transition (use list_available_transitions to see options)",
				},
				duration: {
					type: "number",
					description: "Transition duration in milliseconds (default: 1000)",
				},
			},
			required: ["outgoing_effect_id", "incoming_effect_id", "transition_name"],
		},
	},
	{
		name: "remove_transition",
		description: "Remove a transition by its ID.",
		inputSchema: {
			type: "object" as const,
			properties: {
				transition_id: { type: "string", description: "The ID of the transition to remove" },
			},
			required: ["transition_id"],
		},
	},
	{
		name: "set_transition_duration",
		description: "Update the duration of an existing transition.",
		inputSchema: {
			type: "object" as const,
			properties: {
				transition_id: { type: "string", description: "The ID of the transition" },
				duration: { type: "number", description: "New duration in milliseconds" },
			},
			required: ["transition_id", "duration"],
		},
	},

	// ── Animations ───────────────────────────────────────────────────
	{
		name: "add_animation",
		description:
			"Add an animation to a video or image effect. Animations are entrance ('in') or exit ('out') effects like fade, slide, spin, bounce, wipe, blur, zoom.",
		inputSchema: {
			type: "object" as const,
			properties: {
				effect_id: { type: "string", description: "ID of the video or image effect" },
				animation_name: {
					type: "string",
					enum: [
						"slide-in", "fade-in", "spin-in", "bounce-in", "wipe-in", "blur-in", "zoom-in",
						"slide-out", "fade-out", "spin-out", "bounce-out", "wipe-out", "blur-out", "zoom-out",
					],
					description: "The animation name",
				},
				duration: {
					type: "number",
					description: "Animation duration in milliseconds (default: 500)",
				},
			},
			required: ["effect_id", "animation_name"],
		},
	},
	{
		name: "remove_animation",
		description: "Remove an entrance or exit animation from an effect.",
		inputSchema: {
			type: "object" as const,
			properties: {
				effect_id: { type: "string", description: "ID of the effect" },
				type: {
					type: "string",
					enum: ["in", "out"],
					description: "Remove the entrance ('in') or exit ('out') animation",
				},
			},
			required: ["effect_id", "type"],
		},
	},
	{
		name: "set_animation_duration",
		description: "Update the duration of an existing animation on an effect.",
		inputSchema: {
			type: "object" as const,
			properties: {
				effect_id: { type: "string", description: "ID of the effect that has the animation" },
				duration: { type: "number", description: "New duration in milliseconds" },
			},
			required: ["effect_id", "duration"],
		},
	},

	// ── Filters ──────────────────────────────────────────────────────
	{
		name: "add_filter",
		description:
			"Add a visual filter to a video or image effect. Use list_available_filters to see available types. Filters can only be applied to video and image effects (not audio or text).",
		inputSchema: {
			type: "object" as const,
			properties: {
				effect_id: { type: "string", description: "ID of the video or image effect" },
				filter_type: {
					type: "string",
					description: "The filter type name (e.g., 'BlurFilter', 'GrayscaleFilter')",
				},
			},
			required: ["effect_id", "filter_type"],
		},
	},
	{
		name: "remove_filter",
		description: "Remove a filter from a video or image effect.",
		inputSchema: {
			type: "object" as const,
			properties: {
				effect_id: { type: "string", description: "ID of the video or image effect" },
				filter_type: { type: "string", description: "The filter type name to remove" },
			},
			required: ["effect_id", "filter_type"],
		},
	},

	// ── Playback ─────────────────────────────────────────────────────
	{
		name: "set_playhead",
		description: "Set the playhead (current time position) on the timeline.",
		inputSchema: {
			type: "object" as const,
			properties: {
				timecode: { type: "number", description: "Time position in milliseconds" },
			},
			required: ["timecode"],
		},
	},
	{
		name: "play",
		description: "Start playback from the current playhead position.",
		inputSchema: {
			type: "object" as const,
			properties: {},
			required: [],
		},
	},
	{
		name: "pause",
		description: "Pause playback.",
		inputSchema: {
			type: "object" as const,
			properties: {},
			required: [],
		},
	},

	// ── Project Settings ─────────────────────────────────────────────
	{
		name: "set_project_name",
		description: "Set the project name.",
		inputSchema: {
			type: "object" as const,
			properties: {
				name: { type: "string", description: "The new project name" },
			},
			required: ["name"],
		},
	},
	{
		name: "set_project_resolution",
		description: "Set the project canvas resolution.",
		inputSchema: {
			type: "object" as const,
			properties: {
				width: { type: "number", description: "Width in pixels" },
				height: { type: "number", description: "Height in pixels" },
			},
			required: ["width", "height"],
		},
	},
	{
		name: "set_project_standard",
		description: "Set the project quality standard.",
		inputSchema: {
			type: "object" as const,
			properties: {
				standard: {
					type: "string",
					enum: ["4k", "2k", "1080p", "720p", "480p"],
					description: "Quality standard",
				},
			},
			required: ["standard"],
		},
	},
	{
		name: "set_project_aspect_ratio",
		description: "Set the project aspect ratio.",
		inputSchema: {
			type: "object" as const,
			properties: {
				aspect_ratio: {
					type: "string",
					enum: ["16/9", "1/1", "4/3", "9/16", "3/2", "21/9"],
					description: "Aspect ratio",
				},
			},
			required: ["aspect_ratio"],
		},
	},
	{
		name: "undo",
		description: "Undo the last action (supports up to 64 levels of undo history).",
		inputSchema: {
			type: "object" as const,
			properties: {},
			required: [],
		},
	},
	{
		name: "redo",
		description: "Redo the last undone action.",
		inputSchema: {
			type: "object" as const,
			properties: {},
			required: [],
		},
	},
];

// ─── Tool Handler ────────────────────────────────────────────────────

async function handleToolCall(name: string, args: Record<string, any>): Promise<string> {
	switch (name) {
		// ── Query Tools ──
		case "get_timeline_state":
			return JSON.stringify(await bridge.sendQuery("get_timeline_state"), null, 2);

		case "get_project_info":
			return JSON.stringify(await bridge.sendQuery("get_project_info"), null, 2);

		case "get_effects": {
			const data = await bridge.sendQuery("get_effects", {
				kind: args.kind,
				track: args.track,
			});
			return JSON.stringify(data, null, 2);
		}

		case "get_tracks":
			return JSON.stringify(await bridge.sendQuery("get_tracks"), null, 2);

		case "list_available_filters":
			return JSON.stringify(await bridge.sendQuery("list_available_filters"), null, 2);

		case "list_available_animations":
			return JSON.stringify(await bridge.sendQuery("list_available_animations"), null, 2);

		case "list_available_transitions":
			return JSON.stringify(await bridge.sendQuery("list_available_transitions"), null, 2);

		// ── Effect CRUD ──
		case "add_text_effect":
			return JSON.stringify(
				await bridge.sendAction("add_text_effect", {
					text: args.text,
					start_at_position: args.start_at_position,
					duration: args.duration,
					track: args.track,
					fontSize: args.fontSize,
					fontFamily: args.fontFamily,
					fontWeight: args.fontWeight,
					fontStyle: args.fontStyle,
					align: args.align,
					fill: args.fill,
					position: args.position,
					rotation: args.rotation,
					scale: args.scale,
				}),
				null, 2,
			);

		case "remove_effect":
			return JSON.stringify(
				await bridge.sendAction("remove_effect", { effect_id: args.effect_id }),
				null, 2,
			);

		case "remove_all_effects":
			return JSON.stringify(
				await bridge.sendAction("remove_all_effects", {}),
				null, 2,
			);

		// ── Effect Positioning ──
		case "set_effect_timing":
			return JSON.stringify(
				await bridge.sendAction("set_effect_timing", {
					effect_id: args.effect_id,
					start_at_position: args.start_at_position,
					duration: args.duration,
					start: args.start,
					end: args.end,
					track: args.track,
				}),
				null, 2,
			);

		case "set_effect_position_on_canvas":
			return JSON.stringify(
				await bridge.sendAction("set_effect_position_on_canvas", {
					effect_id: args.effect_id,
					x: args.x,
					y: args.y,
				}),
				null, 2,
			);

		case "rotate_effect":
			return JSON.stringify(
				await bridge.sendAction("rotate_effect", {
					effect_id: args.effect_id,
					rotation: args.rotation,
				}),
				null, 2,
			);

		case "scale_effect":
			return JSON.stringify(
				await bridge.sendAction("scale_effect", {
					effect_id: args.effect_id,
					scaleX: args.scaleX,
					scaleY: args.scaleY,
				}),
				null, 2,
			);

		case "resize_effect":
			return JSON.stringify(
				await bridge.sendAction("resize_effect", {
					effect_id: args.effect_id,
					width: args.width,
					height: args.height,
				}),
				null, 2,
			);

		// ── Text Styling ──
		case "set_text_properties": {
			const { effect_id, ...properties } = args;
			return JSON.stringify(
				await bridge.sendAction("set_text_properties", { effect_id, ...properties }),
				null, 2,
			);
		}

		// ── Track Management ──
		case "add_track":
			return JSON.stringify(await bridge.sendAction("add_track", {}), null, 2);

		case "remove_track":
			return JSON.stringify(
				await bridge.sendAction("remove_track", { track_id: args.track_id }),
				null, 2,
			);

		case "toggle_track_muted":
			return JSON.stringify(
				await bridge.sendAction("toggle_track_muted", { track_id: args.track_id }),
				null, 2,
			);

		case "toggle_track_visibility":
			return JSON.stringify(
				await bridge.sendAction("toggle_track_visibility", { track_id: args.track_id }),
				null, 2,
			);

		case "toggle_track_locked":
			return JSON.stringify(
				await bridge.sendAction("toggle_track_locked", { track_id: args.track_id }),
				null, 2,
			);

		// ── Transitions ──
		case "add_transition":
			return JSON.stringify(
				await bridge.sendAction("add_transition", {
					outgoing_effect_id: args.outgoing_effect_id,
					incoming_effect_id: args.incoming_effect_id,
					transition_name: args.transition_name,
					duration: args.duration ?? 1000,
				}),
				null, 2,
			);

		case "remove_transition":
			return JSON.stringify(
				await bridge.sendAction("remove_transition", { transition_id: args.transition_id }),
				null, 2,
			);

		case "set_transition_duration":
			return JSON.stringify(
				await bridge.sendAction("set_transition_duration", {
					transition_id: args.transition_id,
					duration: args.duration,
				}),
				null, 2,
			);

		// ── Animations ──
		case "add_animation":
			return JSON.stringify(
				await bridge.sendAction("add_animation", {
					effect_id: args.effect_id,
					animation_name: args.animation_name,
					duration: args.duration ?? 500,
				}),
				null, 2,
			);

		case "remove_animation":
			return JSON.stringify(
				await bridge.sendAction("remove_animation", {
					effect_id: args.effect_id,
					type: args.type,
				}),
				null, 2,
			);

		case "set_animation_duration":
			return JSON.stringify(
				await bridge.sendAction("set_animation_duration", {
					effect_id: args.effect_id,
					duration: args.duration,
				}),
				null, 2,
			);

		// ── Filters ──
		case "add_filter":
			return JSON.stringify(
				await bridge.sendAction("add_filter", {
					effect_id: args.effect_id,
					filter_type: args.filter_type,
				}),
				null, 2,
			);

		case "remove_filter":
			return JSON.stringify(
				await bridge.sendAction("remove_filter", {
					effect_id: args.effect_id,
					filter_type: args.filter_type,
				}),
				null, 2,
			);

		// ── Playback ──
		case "set_playhead":
			return JSON.stringify(
				await bridge.sendAction("set_playhead", { timecode: args.timecode }),
				null, 2,
			);

		case "play":
			return JSON.stringify(await bridge.sendAction("play", {}), null, 2);

		case "pause":
			return JSON.stringify(await bridge.sendAction("pause", {}), null, 2);

		// ── Project Settings ──
		case "set_project_name":
			return JSON.stringify(
				await bridge.sendAction("set_project_name", { name: args.name }),
				null, 2,
			);

		case "set_project_resolution":
			return JSON.stringify(
				await bridge.sendAction("set_project_resolution", {
					width: args.width,
					height: args.height,
				}),
				null, 2,
			);

		case "set_project_standard":
			return JSON.stringify(
				await bridge.sendAction("set_project_standard", { standard: args.standard }),
				null, 2,
			);

		case "set_project_aspect_ratio":
			return JSON.stringify(
				await bridge.sendAction("set_project_aspect_ratio", { aspect_ratio: args.aspect_ratio }),
				null, 2,
			);

		case "undo":
			return JSON.stringify(await bridge.sendAction("undo", {}), null, 2);

		case "redo":
			return JSON.stringify(await bridge.sendAction("redo", {}), null, 2);

		default:
			throw new Error(`Unknown tool: ${name}`);
	}
}

// ─── Server Setup ────────────────────────────────────────────────────

const server = new Server(
	{
		name: "omniclip-mcp",
		version: "1.0.0",
	},
	{
		capabilities: {
			tools: {},
		},
	},
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
	tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
	const { name, arguments: args } = request.params;
	try {
		const result = await handleToolCall(name, args ?? {});
		return {
			content: [{ type: "text" as const, text: result }],
		};
	} catch (error: any) {
		return {
			content: [
				{
					type: "text" as const,
					text: JSON.stringify({
						error: error.message || "Unknown error",
						tool: name,
					}),
				},
			],
			isError: true,
		};
	}
});

// ─── Start ───────────────────────────────────────────────────────────

async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("[MCP Server] Omniclip MCP server started (stdio transport)");
	console.error(`[MCP Server] WebSocket bridge on ws://localhost:${WS_PORT}`);
}

main().catch((err) => {
	console.error("[MCP Server] Fatal error:", err);
	process.exit(1);
});
