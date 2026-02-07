import {generate_id} from "@benev/slate"

import {omnislate} from "../../context.js"
import {
	AnyEffect,
	ImageEffect,
	TextEffect,
	VideoEffect,
	State,
} from "../../types.js"
import {find_place_for_new_effect} from "../timeline/utils/find_place_for_new_effect.js"
import {
	FilterType,
	FilterSchemas,
} from "../compositor/parts/filter-manager.js"
import {
	animationIn,
	animationOut,
	type Animation,
	type AnimationFor,
} from "../compositor/parts/animation-manager.js"
import type {Transition} from "../compositor/parts/transition-manager.js"

// ─── Protocol Types ──────────────────────────────────────────────────

interface BridgeRequest {
	id: string
	type: "action" | "query"
	actionType?: string
	queryType?: string
	payload?: any
}

interface BridgeResponse {
	id: string
	success: boolean
	data?: any
	error?: string
}

// ─── MCP Bridge Controller ──────────────────────────────────────────

export class MCPBridge {
	private ws: WebSocket | null = null
	private reconnectTimer: number | null = null
	private reconnectDelay = 2000

	connect(url = "ws://localhost:9876") {
		try {
			this.ws = new WebSocket(url)

			this.ws.onopen = () => {
				console.log("[MCP Bridge] Connected to MCP server")
				this.reconnectDelay = 2000
			}

			this.ws.onmessage = (event: MessageEvent) => {
				try {
					const request: BridgeRequest = JSON.parse(event.data)
					this.handleMessage(request)
				} catch (err) {
					console.error("[MCP Bridge] Failed to parse message:", err)
				}
			}

			this.ws.onclose = () => {
				console.log("[MCP Bridge] Disconnected from MCP server, will retry...")
				this.ws = null
				this.scheduleReconnect(url)
			}

			this.ws.onerror = () => {
				// onclose will fire after this, triggering reconnect
			}
		} catch {
			this.scheduleReconnect(url)
		}
	}

	private scheduleReconnect(url: string) {
		if (this.reconnectTimer !== null) return
		this.reconnectTimer = window.setTimeout(() => {
			this.reconnectTimer = null
			this.reconnectDelay = Math.min(this.reconnectDelay * 1.5, 10000)
			this.connect(url)
		}, this.reconnectDelay)
	}

	private send(response: BridgeResponse) {
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify(response))
		}
	}

	private async handleMessage(request: BridgeRequest) {
		try {
			let result: any
			if (request.type === "query") {
				result = this.handleQuery(request)
			} else if (request.type === "action") {
				result = await this.handleAction(request)
			} else {
				throw new Error(`Unknown request type: ${request.type}`)
			}
			this.send({id: request.id, success: true, data: result})
		} catch (err: any) {
			console.error("[MCP Bridge] Error handling request:", err)
			this.send({
				id: request.id,
				success: false,
				error: err.message || String(err),
			})
		}
	}

	// ─── Query Handlers ──────────────────────────────────────────────

	private handleQuery(request: BridgeRequest): any {
		const ctx = omnislate.context
		const state = ctx.state

		switch (request.queryType) {
			case "get_timeline_state":
				return this.serializeState(state)

			case "get_project_info":
				return {
					projectName: state.projectName,
					projectId: state.projectId,
					settings: state.settings,
					stats: {
						effectCount: state.effects.length,
						trackCount: state.tracks.length,
						durationMs: state.effects.length > 0
							? Math.max(
									...state.effects.map(
										(e) => e.start_at_position + (e.end - e.start)
									)
								)
							: 0,
					},
					playback: {
						timecode: state.timecode,
						isPlaying: state.is_playing,
						fps: state.fps,
						timebase: state.timebase,
					},
				}

			case "get_effects": {
				let effects = [...state.effects]
				if (request.payload?.kind) {
					effects = effects.filter((e) => e.kind === request.payload.kind)
				}
				if (request.payload?.track !== undefined) {
					effects = effects.filter(
						(e) => e.track === request.payload.track
					)
				}
				return effects.map((e) => this.serializeEffect(e))
			}

			case "get_tracks":
				return state.tracks.map((t, i) => ({
					id: t.id,
					index: i,
					locked: t.locked,
					visible: t.visible,
					muted: t.muted,
				}))

			case "list_available_filters":
				return Object.keys(FilterSchemas)

			case "list_available_animations":
				return {
					in: [...animationIn],
					out: [...animationOut],
				}

			case "list_available_transitions":
				return (window.GLTransitions || []).map((t) => ({
					name: t.name,
					author: t.author,
				}))

			default:
				throw new Error(`Unknown query type: ${request.queryType}`)
		}
	}

	// ─── Action Handlers ─────────────────────────────────────────────

	private handleAction(request: BridgeRequest): any {
		const actionType = request.actionType!
		const payload = request.payload || {}
		const ctx = omnislate.context
		const state = ctx.state

		// Specialized handlers for actions requiring compositor side-effects
		const handler = this.actionHandlers[actionType]
		if (handler) {
			return handler(payload, state)
		}

		throw new Error(`Unknown action type: ${actionType}`)
	}

	private actionHandlers: Record<
		string,
		(payload: any, state: State) => any
	> = {
		// ── Effect CRUD ──────────────────────────────────────────────

		add_text_effect: (payload, state) => {
			const ctx = omnislate.context
			const duration = payload.duration ?? 5000

			const effect: TextEffect = {
				id: generate_id(),
				kind: "text",
				start_at_position: 0,
				duration,
				start: 0,
				end: duration,
				track: 0,
				fontSize: payload.fontSize ?? 38,
				text: payload.text ?? "Default text",
				fontStyle: payload.fontStyle ?? "normal",
				fontFamily: payload.fontFamily ?? "Arial",
				align: payload.align ?? "center",
				fontVariant: "normal",
				fontWeight: payload.fontWeight ?? "normal",
				fill: payload.fill ?? ["#FFFFFF"],
				fillGradientStops: [],
				fillGradientType: 0,
				stroke: "#FFFFFF",
				strokeThickness: 0,
				lineJoin: "miter",
				miterLimit: 10,
				textBaseline: "alphabetic",
				letterSpacing: 0,
				dropShadow: false,
				dropShadowDistance: 5,
				dropShadowAlpha: 1,
				dropShadowBlur: 0,
				dropShadowAngle: 0.5,
				dropShadowColor: "#FFFFFF",
				breakWords: false,
				wordWrap: false,
				lineHeight: 0,
				leading: 0,
				wordWrapWidth: 100,
				whiteSpace: "pre",
				rect: {
					position_on_canvas: payload.position ?? {
						x: ctx.controllers.compositor.app.stage.width / 2,
						y: ctx.controllers.compositor.app.stage.height / 2,
					},
					pivot: {x: 0, y: 0},
					scaleX: payload.scale?.x ?? 1,
					scaleY: payload.scale?.y ?? 1,
					width: 100,
					height: 20,
					rotation: payload.rotation ?? 0,
				},
			}

			// Auto-place if position not specified
			if (payload.start_at_position !== undefined) {
				effect.start_at_position = payload.start_at_position
			} else {
				const {position, track} = find_place_for_new_effect(
					state.effects,
					state.tracks
				)
				effect.start_at_position = position!
				effect.track = track
			}
			if (payload.track !== undefined) {
				effect.track = payload.track
			}

			// Add to compositor (creates PIXI text + adds to state)
			ctx.controllers.compositor.managers.textManager.add_text_effect(
				effect
			)
			ctx.controllers.compositor.update_canvas_objects(ctx.state)

			return {
				ok: true,
				effect_id: effect.id,
				start_at_position: effect.start_at_position,
				track: effect.track,
			}
		},

		remove_effect: (payload, state) => {
			const ctx = omnislate.context
			const effect = state.effects.find(
				(e) => e.id === payload.effect_id
			)
			if (!effect)
				throw new Error(`Effect not found: ${payload.effect_id}`)

			// Remove animations targeting this effect
			ctx.controllers.compositor.managers.animationManager.removeAnimations(
				effect
			)

			// Remove transitions involving this effect
			ctx.state.transitions
				.filter(
					(t) =>
						t.incoming.id === effect.id ||
						t.outgoing.id === effect.id
				)
				.forEach((t) =>
					ctx.controllers.compositor.managers.transitionManager.removeTransition(
						t.id
					)
				)

			// Remove filters targeting this effect
			const filtersToRemove = state.filters.filter(
				(f) => f.targetEffectId === effect.id
			)
			for (const f of filtersToRemove) {
				const eff = effect as VideoEffect | ImageEffect
				ctx.controllers.compositor.managers.filtersManager.removeFilterFromEffect(
					eff,
					f.type
				)
			}

			// Remove from canvas based on kind
			switch (effect.kind) {
				case "video":
					ctx.controllers.compositor.managers.videoManager.remove_video_from_canvas(
						effect
					)
					break
				case "image":
					ctx.controllers.compositor.managers.imageManager.remove_image_from_canvas(
						effect
					)
					break
				case "text":
					ctx.controllers.compositor.managers.textManager.remove_text_from_canvas(
						effect
					)
					break
			}

			ctx.actions.remove_effect(effect)
			ctx.actions.set_selected_effect(null)
			ctx.controllers.compositor.update_canvas_objects(ctx.state)

			return {ok: true}
		},

		remove_all_effects: (_payload, _state) => {
			omnislate.context.clear_project()
			return {ok: true}
		},

		// ── Effect Positioning/Timing ────────────────────────────────

		set_effect_timing: (payload, state) => {
			const ctx = omnislate.context
			const effect = state.effects.find(
				(e) => e.id === payload.effect_id
			)
			if (!effect)
				throw new Error(`Effect not found: ${payload.effect_id}`)

			if (payload.start_at_position !== undefined) {
				ctx.actions.set_effect_start_position(
					effect,
					payload.start_at_position
				)
			}
			if (payload.start !== undefined) {
				ctx.actions.set_effect_start(effect, payload.start)
			}
			if (payload.end !== undefined) {
				ctx.actions.set_effect_end(effect, payload.end)
			}
			if (payload.duration !== undefined) {
				ctx.actions.set_effect_duration(effect, payload.duration)
			}
			if (payload.track !== undefined) {
				ctx.actions.set_effect_track(effect, payload.track)
			}

			ctx.controllers.compositor.update_canvas_objects(ctx.state)
			return {ok: true}
		},

		set_effect_position_on_canvas: (payload, state) => {
			const ctx = omnislate.context
			const effect = state.effects.find(
				(e) => e.id === payload.effect_id
			)
			if (!effect)
				throw new Error(`Effect not found: ${payload.effect_id}`)
			if (effect.kind === "audio")
				throw new Error("Audio effects have no canvas position")

			ctx.actions.set_position_on_canvas(
				effect as VideoEffect | ImageEffect | TextEffect,
				payload.x,
				payload.y
			)
			ctx.controllers.compositor.update_canvas_objects(ctx.state)
			return {ok: true}
		},

		rotate_effect: (payload, state) => {
			const ctx = omnislate.context
			const effect = state.effects.find(
				(e) => e.id === payload.effect_id
			)
			if (!effect)
				throw new Error(`Effect not found: ${payload.effect_id}`)
			if (effect.kind === "audio")
				throw new Error("Audio effects cannot be rotated")

			ctx.actions.set_rotation(
				effect as VideoEffect | ImageEffect | TextEffect,
				payload.rotation
			)
			ctx.controllers.compositor.update_canvas_objects(ctx.state)
			return {ok: true}
		},

		scale_effect: (payload, state) => {
			const ctx = omnislate.context
			const effect = state.effects.find(
				(e) => e.id === payload.effect_id
			)
			if (!effect)
				throw new Error(`Effect not found: ${payload.effect_id}`)
			if (effect.kind === "audio")
				throw new Error("Audio effects cannot be scaled")

			ctx.actions.set_effect_scale(
				effect as VideoEffect | ImageEffect | TextEffect,
				{x: payload.scaleX, y: payload.scaleY}
			)
			ctx.controllers.compositor.update_canvas_objects(ctx.state)
			return {ok: true}
		},

		resize_effect: (payload, state) => {
			const ctx = omnislate.context
			const effect = state.effects.find(
				(e) => e.id === payload.effect_id
			)
			if (!effect)
				throw new Error(`Effect not found: ${payload.effect_id}`)
			if (effect.kind === "audio")
				throw new Error("Audio effects cannot be resized")

			const visual = effect as VideoEffect | ImageEffect | TextEffect
			if (payload.width !== undefined) {
				ctx.actions.set_effect_width(visual, payload.width)
			}
			if (payload.height !== undefined) {
				ctx.actions.set_effect_height(visual, payload.height)
			}
			ctx.controllers.compositor.update_canvas_objects(ctx.state)
			return {ok: true}
		},

		// ── Text Styling ─────────────────────────────────────────────

		set_text_properties: (payload, state) => {
			const ctx = omnislate.context
			const effect = state.effects.find(
				(e) => e.id === payload.effect_id
			)
			if (!effect)
				throw new Error(`Effect not found: ${payload.effect_id}`)
			if (effect.kind !== "text")
				throw new Error(
					`Effect ${payload.effect_id} is not a text effect (it's ${effect.kind})`
				)

			const textEffect = effect as TextEffect
			const textObj =
				ctx.controllers.compositor.managers.textManager.get(
					textEffect.id
				)

			// Dispatch individual actions for each provided property
			if (payload.text !== undefined) {
				ctx.actions.set_text_content(textEffect, payload.text)
				if (textObj) textObj.sprite.text = payload.text
			}
			if (payload.fontSize !== undefined) {
				ctx.actions.set_font_size(textEffect, payload.fontSize)
				if (textObj) textObj.sprite.style.fontSize = payload.fontSize
			}
			if (payload.fontFamily !== undefined) {
				ctx.actions.set_text_font(textEffect, payload.fontFamily)
				if (textObj)
					textObj.sprite.style.fontFamily = payload.fontFamily
			}
			if (payload.fontWeight !== undefined) {
				ctx.actions.set_font_weight(textEffect, payload.fontWeight)
				if (textObj)
					textObj.sprite.style.fontWeight = payload.fontWeight
			}
			if (payload.fontStyle !== undefined) {
				ctx.actions.set_font_style(textEffect, payload.fontStyle)
				if (textObj)
					textObj.sprite.style.fontStyle = payload.fontStyle
			}
			if (payload.fontVariant !== undefined) {
				ctx.actions.set_font_variant(textEffect, payload.fontVariant)
				if (textObj)
					textObj.sprite.style.fontVariant = payload.fontVariant
			}
			if (payload.align !== undefined) {
				ctx.actions.set_font_align(textEffect, payload.align)
				if (textObj) textObj.sprite.style.align = payload.align
			}
			if (payload.fill !== undefined) {
				// Replace all fills
				const currentFills = textEffect.fill.length
				// Remove extra fills
				for (let i = currentFills - 1; i >= payload.fill.length; i--) {
					ctx.actions.remove_text_fill(textEffect, i)
				}
				// Set/add fills
				for (let i = 0; i < payload.fill.length; i++) {
					if (i < currentFills) {
						ctx.actions.set_text_fill(
							textEffect,
							payload.fill[i],
							i
						)
					} else {
						ctx.actions.add_text_fill(textEffect)
						ctx.actions.set_text_fill(
							textEffect,
							payload.fill[i],
							i
						)
					}
				}
				if (textObj) {
					//@ts-ignore
					textObj.sprite.style.fill = [...payload.fill]
				}
			}
			if (payload.fillGradientType !== undefined) {
				ctx.actions.set_fill_gradient_type(
					textEffect,
					payload.fillGradientType
				)
				if (textObj)
					//@ts-ignore
					textObj.sprite.style.fillGradientType =
						payload.fillGradientType
			}
			if (payload.fillGradientStops !== undefined) {
				// Clear and re-add stops
				const currentStops = textEffect.fillGradientStops.length
				for (let i = currentStops - 1; i >= 0; i--) {
					ctx.actions.remove_fill_gradient_stop(textEffect, i)
				}
				for (let i = 0; i < payload.fillGradientStops.length; i++) {
					ctx.actions.add_fill_gradient_stop(textEffect)
					ctx.actions.set_fill_gradient_stop(
						textEffect,
						i,
						payload.fillGradientStops[i]
					)
				}
				if (textObj)
					//@ts-ignore
					textObj.sprite.style.fillGradientStops = [
						...payload.fillGradientStops,
					]
			}
			if (payload.stroke !== undefined) {
				ctx.actions.set_stroke_color(textEffect, payload.stroke)
				if (textObj) textObj.sprite.style.stroke = payload.stroke
			}
			if (payload.strokeThickness !== undefined) {
				ctx.actions.set_stroke_thickness(
					textEffect,
					payload.strokeThickness
				)
				if (textObj)
					//@ts-ignore
					textObj.sprite.style.strokeThickness =
						payload.strokeThickness
			}
			if (payload.lineJoin !== undefined) {
				ctx.actions.set_stroke_line_join(textEffect, payload.lineJoin)
				if (textObj)
					//@ts-ignore
					textObj.sprite.style.lineJoin = payload.lineJoin
			}
			if (payload.miterLimit !== undefined) {
				ctx.actions.set_stroke_miter_limit(
					textEffect,
					payload.miterLimit
				)
				if (textObj)
					//@ts-ignore
					textObj.sprite.style.miterLimit = payload.miterLimit
			}
			if (payload.letterSpacing !== undefined) {
				ctx.actions.set_letter_spacing(
					textEffect,
					payload.letterSpacing
				)
				if (textObj)
					textObj.sprite.style.letterSpacing = payload.letterSpacing
			}
			if (payload.textBaseline !== undefined) {
				ctx.actions.set_text_baseline(
					textEffect,
					payload.textBaseline
				)
				if (textObj)
					textObj.sprite.style.textBaseline = payload.textBaseline
			}
			if (payload.dropShadow !== undefined) {
				ctx.actions.toggle_drop_shadow(textEffect, payload.dropShadow)
				if (textObj)
					textObj.sprite.style.dropShadow = payload.dropShadow
			}
			if (payload.dropShadowColor !== undefined) {
				ctx.actions.set_drop_shadow_color(
					textEffect,
					payload.dropShadowColor
				)
				if (textObj)
					//@ts-ignore
					textObj.sprite.style.dropShadowColor =
						payload.dropShadowColor
			}
			if (payload.dropShadowAlpha !== undefined) {
				ctx.actions.set_drop_shadow_alpha(
					textEffect,
					payload.dropShadowAlpha
				)
				if (textObj)
					//@ts-ignore
					textObj.sprite.style.dropShadowAlpha =
						payload.dropShadowAlpha
			}
			if (payload.dropShadowAngle !== undefined) {
				ctx.actions.set_drop_shadow_angle(
					textEffect,
					payload.dropShadowAngle
				)
				if (textObj)
					//@ts-ignore
					textObj.sprite.style.dropShadowAngle =
						payload.dropShadowAngle
			}
			if (payload.dropShadowBlur !== undefined) {
				ctx.actions.set_drop_shadow_blur(
					textEffect,
					payload.dropShadowBlur
				)
				if (textObj)
					//@ts-ignore
					textObj.sprite.style.dropShadowBlur =
						payload.dropShadowBlur
			}
			if (payload.dropShadowDistance !== undefined) {
				ctx.actions.set_drop_shadow_distance(
					textEffect,
					payload.dropShadowDistance
				)
				if (textObj)
					//@ts-ignore
					textObj.sprite.style.dropShadowDistance =
						payload.dropShadowDistance
			}
			if (payload.wordWrap !== undefined) {
				ctx.actions.set_word_wrap(textEffect, payload.wordWrap)
				if (textObj)
					textObj.sprite.style.wordWrap = payload.wordWrap
			}
			if (payload.wordWrapWidth !== undefined) {
				ctx.actions.set_wrap_width(textEffect, payload.wordWrapWidth)
				if (textObj)
					textObj.sprite.style.wordWrapWidth = payload.wordWrapWidth
			}
			if (payload.breakWords !== undefined) {
				ctx.actions.set_break_words(textEffect, payload.breakWords)
				if (textObj)
					textObj.sprite.style.breakWords = payload.breakWords
			}
			if (payload.lineHeight !== undefined) {
				ctx.actions.set_line_height(textEffect, payload.lineHeight)
				if (textObj)
					textObj.sprite.style.lineHeight = payload.lineHeight
			}
			if (payload.leading !== undefined) {
				ctx.actions.set_leading(textEffect, payload.leading)
				if (textObj) textObj.sprite.style.leading = payload.leading
			}
			if (payload.whiteSpace !== undefined) {
				ctx.actions.set_white_space(textEffect, payload.whiteSpace)
				if (textObj)
					textObj.sprite.style.whiteSpace = payload.whiteSpace
			}

			// Force PIXI text re-render
			if (textObj) {
				//@ts-ignore
				textObj.sprite.updateText()
			}

			return {ok: true}
		},

		// ── Track Management ─────────────────────────────────────────

		add_track: (_payload, _state) => {
			omnislate.context.actions.add_track()
			return {ok: true, trackCount: omnislate.context.state.tracks.length}
		},

		remove_track: (payload, state) => {
			const track = state.tracks.find((t) => t.id === payload.track_id)
			if (!track) throw new Error(`Track not found: ${payload.track_id}`)
			omnislate.context.actions.remove_track(payload.track_id)
			return {ok: true}
		},

		toggle_track_muted: (payload, state) => {
			const track = state.tracks.find((t) => t.id === payload.track_id)
			if (!track) throw new Error(`Track not found: ${payload.track_id}`)
			omnislate.context.actions.toggle_track_muted(payload.track_id)
			return {ok: true, muted: !track.muted}
		},

		toggle_track_visibility: (payload, state) => {
			const track = state.tracks.find((t) => t.id === payload.track_id)
			if (!track) throw new Error(`Track not found: ${payload.track_id}`)
			omnislate.context.actions.toggle_track_visibility(payload.track_id)
			return {ok: true, visible: !track.visible}
		},

		toggle_track_locked: (payload, state) => {
			const track = state.tracks.find((t) => t.id === payload.track_id)
			if (!track) throw new Error(`Track not found: ${payload.track_id}`)
			omnislate.context.actions.toggle_track_locked(payload.track_id)
			return {ok: true, locked: !track.locked}
		},

		// ── Transitions ──────────────────────────────────────────────

		add_transition: (payload, state) => {
			const ctx = omnislate.context
			const outgoing = state.effects.find(
				(e) => e.id === payload.outgoing_effect_id
			)
			const incoming = state.effects.find(
				(e) => e.id === payload.incoming_effect_id
			)

			if (!outgoing)
				throw new Error(
					`Outgoing effect not found: ${payload.outgoing_effect_id}`
				)
			if (!incoming)
				throw new Error(
					`Incoming effect not found: ${payload.incoming_effect_id}`
				)
			if (
				outgoing.kind !== "video" &&
				outgoing.kind !== "image"
			)
				throw new Error(
					"Transitions only work with video and image effects"
				)
			if (
				incoming.kind !== "video" &&
				incoming.kind !== "image"
			)
				throw new Error(
					"Transitions only work with video and image effects"
				)

			// Find the GL transition by name
			const glTransition = (window.GLTransitions || []).find(
				(t) => t.name === payload.transition_name
			)
			if (!glTransition)
				throw new Error(
					`Transition not found: ${payload.transition_name}. Use list_available_transitions to see options.`
				)

			const transitionId = generate_id()
			const duration = payload.duration ?? 1000

			const transition: Transition = {
				id: transitionId,
				duration,
				incoming: incoming as VideoEffect | ImageEffect,
				outgoing: outgoing as VideoEffect | ImageEffect,
				transition: glTransition,
			}

			// Use the transition manager to properly set up the transition
			// (adjusts effect positions and creates render textures)
			// selectTransition().apply() handles both compositor setup and state action dispatch
			const result =
				ctx.controllers.compositor.managers.transitionManager.selectTransition(
					transition
				)
			result.apply(ctx.state)
			ctx.controllers.compositor.update_canvas_objects(ctx.state)

			return {ok: true, transition_id: transitionId}
		},

		remove_transition: (payload, _state) => {
			const ctx = omnislate.context
			const transition = ctx.state.transitions.find(
				(t) => t.id === payload.transition_id
			)
			if (!transition)
				throw new Error(
					`Transition not found: ${payload.transition_id}`
				)

			ctx.controllers.compositor.managers.transitionManager.removeTransition(
				payload.transition_id
			)
			ctx.controllers.compositor.update_canvas_objects(ctx.state)
			return {ok: true}
		},

		set_transition_duration: (payload, _state) => {
			const ctx = omnislate.context
			const transition = ctx.state.transitions.find(
				(t) => t.id === payload.transition_id
			)
			if (!transition)
				throw new Error(
					`Transition not found: ${payload.transition_id}`
				)

			ctx.actions.set_transition_duration(
				payload.duration,
				payload.transition_id
			)
			// Use update(id) directly instead of updateTransition() which depends on transitionManager.selected
			ctx.controllers.compositor.managers.transitionManager.update(
				payload.transition_id
			)
			ctx.actions.update_transition(payload.transition_id)
			ctx.controllers.compositor.update_canvas_objects(ctx.state)
			return {ok: true}
		},

		// ── Animations ───────────────────────────────────────────────

		add_animation: (payload, state) => {
			const ctx = omnislate.context
			const effect = state.effects.find(
				(e) => e.id === payload.effect_id
			)
			if (!effect)
				throw new Error(`Effect not found: ${payload.effect_id}`)
			if (effect.kind !== "video" && effect.kind !== "image")
				throw new Error(
					"Animations can only be applied to video and image effects"
				)

			const animName = payload.animation_name as string
			const isIn = animName.endsWith("-in")
			const type: "in" | "out" = isIn ? "in" : "out"
			const duration = payload.duration ?? 500

			const animation: Animation = {
				targetEffect: effect as VideoEffect | ImageEffect,
				name: animName as any,
				type,
				duration,
				for: "Animation" as AnimationFor,
			}

			ctx.controllers.compositor.managers.animationManager.selectAnimation(
				effect as VideoEffect | ImageEffect,
				animation,
				state
			)
			ctx.controllers.compositor.update_canvas_objects(ctx.state)

			return {ok: true}
		},

		remove_animation: (payload, state) => {
			const ctx = omnislate.context
			const effect = state.effects.find(
				(e) => e.id === payload.effect_id
			)
			if (!effect)
				throw new Error(`Effect not found: ${payload.effect_id}`)
			if (effect.kind !== "video" && effect.kind !== "image")
				throw new Error(
					"Animations can only be removed from video and image effects"
				)

			ctx.controllers.compositor.managers.animationManager.removeAnimation(
				state,
				effect as VideoEffect | ImageEffect,
				payload.type
			)
			ctx.controllers.compositor.update_canvas_objects(ctx.state)

			return {ok: true}
		},

		set_animation_duration: (payload, state) => {
			const ctx = omnislate.context
			const effect = state.effects.find(
				(e) => e.id === payload.effect_id
			)
			if (!effect)
				throw new Error(`Effect not found: ${payload.effect_id}`)

			ctx.actions.set_animation_duration(
				payload.duration,
				effect as VideoEffect | ImageEffect
			)
			return {ok: true}
		},

		// ── Filters ──────────────────────────────────────────────────

		add_filter: (payload, state) => {
			const ctx = omnislate.context
			const effect = state.effects.find(
				(e) => e.id === payload.effect_id
			)
			if (!effect)
				throw new Error(`Effect not found: ${payload.effect_id}`)
			if (effect.kind !== "video" && effect.kind !== "image")
				throw new Error(
					"Filters can only be applied to video and image effects"
				)

			const filterType = payload.filter_type as FilterType

			// Check if filter type is valid
			if (!FilterSchemas[filterType])
				throw new Error(
					`Invalid filter type: ${filterType}. Use list_available_filters to see options.`
				)

			// addFilterToEffect handles both PIXI filter creation and state action dispatch
			ctx.controllers.compositor.managers.filtersManager.addFilterToEffect(
				effect as VideoEffect | ImageEffect,
				filterType
			)

			return {ok: true}
		},

		remove_filter: (payload, state) => {
			const ctx = omnislate.context
			const effect = state.effects.find(
				(e) => e.id === payload.effect_id
			)
			if (!effect)
				throw new Error(`Effect not found: ${payload.effect_id}`)
			if (effect.kind !== "video" && effect.kind !== "image")
				throw new Error(
					"Filters can only be removed from video and image effects"
				)

			const filterType = payload.filter_type as FilterType

			// removeFilterFromEffect handles both PIXI filter removal and state action dispatch
			ctx.controllers.compositor.managers.filtersManager.removeFilterFromEffect(
				effect as VideoEffect | ImageEffect,
				filterType
			)

			return {ok: true}
		},

		// ── Playback ─────────────────────────────────────────────────

		set_playhead: async (payload, _state) => {
			const ctx = omnislate.context
			ctx.actions.set_timecode(payload.timecode)
			await ctx.controllers.compositor.seek(payload.timecode, true)
			ctx.controllers.compositor.compose_effects(
				ctx.state.effects,
				payload.timecode
			)
			return {ok: true, timecode: payload.timecode}
		},

		play: (_payload, _state) => {
			omnislate.context.actions.set_is_playing(true)
			return {ok: true}
		},

		pause: (_payload, _state) => {
			omnislate.context.actions.set_is_playing(false)
			return {ok: true}
		},

		// ── Project Settings ─────────────────────────────────────────

		set_project_name: (payload, _state) => {
			omnislate.context.actions.set_project_name(payload.name)
			return {ok: true}
		},

		set_project_resolution: (payload, _state) => {
			const ctx = omnislate.context
			ctx.actions.set_project_resolution(payload.width, payload.height)
			ctx.controllers.compositor.set_canvas_resolution(
				payload.width,
				payload.height
			)
			return {ok: true}
		},

		set_project_standard: (payload, _state) => {
			omnislate.context.actions.set_standard(payload.standard)
			return {ok: true}
		},

		set_project_aspect_ratio: (payload, _state) => {
			omnislate.context.actions.set_aspect_ratio(payload.aspect_ratio)
			return {ok: true}
		},

		// ── Undo/Redo ────────────────────────────────────────────────

		undo: (_payload, _state) => {
			omnislate.context.undo()
			return {ok: true}
		},

		redo: (_payload, _state) => {
			omnislate.context.redo()
			return {ok: true}
		},
	}

	// ─── State Serialization ─────────────────────────────────────────

	private serializeState(state: State) {
		return {
			project: {
				name: state.projectName,
				id: state.projectId,
				settings: state.settings,
			},
			playback: {
				timecode: state.timecode,
				isPlaying: state.is_playing,
				timebase: state.timebase,
				fps: state.fps,
			},
			tracks: state.tracks.map((t, i) => ({
				id: t.id,
				index: i,
				locked: t.locked,
				visible: t.visible,
				muted: t.muted,
			})),
			effects: state.effects.map((e) => this.serializeEffect(e)),
			filters: state.filters.map((f) => ({
				targetEffectId: f.targetEffectId,
				type: f.type,
			})),
			animations: state.animations.map((a) => ({
				targetEffectId: a.targetEffect.id,
				name: a.name,
				type: a.type,
				duration: a.duration,
				for: a.for,
			})),
			transitions: state.transitions.map((t) => ({
				id: t.id,
				duration: t.duration,
				incomingEffectId: t.incoming.id,
				outgoingEffectId: t.outgoing.id,
				transitionName: t.transition.name,
			})),
		}
	}

	private serializeEffect(e: AnyEffect) {
		const base = {
			id: e.id,
			kind: e.kind,
			track: e.track,
			start_at_position: e.start_at_position,
			duration: e.duration,
			start: e.start,
			end: e.end,
		}

		switch (e.kind) {
			case "video":
				return {
					...base,
					name: e.name,
					file_hash: e.file_hash,
					raw_duration: e.raw_duration,
					frames: e.frames,
					rect: {
						position: e.rect.position_on_canvas,
						scale: {x: e.rect.scaleX, y: e.rect.scaleY},
						rotation: e.rect.rotation,
						width: e.rect.width,
						height: e.rect.height,
						pivot: e.rect.pivot,
					},
				}
			case "audio":
				return {
					...base,
					name: e.name,
					file_hash: e.file_hash,
					raw_duration: e.raw_duration,
				}
			case "image":
				return {
					...base,
					name: e.name,
					file_hash: e.file_hash,
					rect: {
						position: e.rect.position_on_canvas,
						scale: {x: e.rect.scaleX, y: e.rect.scaleY},
						rotation: e.rect.rotation,
						width: e.rect.width,
						height: e.rect.height,
						pivot: e.rect.pivot,
					},
				}
			case "text":
				return {
					...base,
					text: e.text,
					fontSize: e.fontSize,
					fontFamily: e.fontFamily,
					fontWeight: e.fontWeight,
					fontStyle: e.fontStyle,
					align: e.align,
					fill: e.fill,
					stroke: e.stroke,
					strokeThickness: e.strokeThickness,
					dropShadow: e.dropShadow,
					wordWrap: e.wordWrap,
					letterSpacing: e.letterSpacing,
					rect: {
						position: e.rect.position_on_canvas,
						scale: {x: e.rect.scaleX, y: e.rect.scaleY},
						rotation: e.rect.rotation,
						width: e.rect.width,
						height: e.rect.height,
						pivot: e.rect.pivot,
					},
				}
		}
	}

	disconnect() {
		if (this.reconnectTimer !== null) {
			clearTimeout(this.reconnectTimer)
			this.reconnectTimer = null
		}
		if (this.ws) {
			this.ws.close()
			this.ws = null
		}
	}
}
