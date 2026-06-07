import * as tact from "@benev/tact"
import type {Atom} from "@benev/tact"

import {bindings} from "./bindings.js"
import {TimelineAction} from "./meta.js"
import {OmniSession} from "../../../ui/logic/session.js"
import {bladeTool} from "../../../ui/logic/parts/modes/blade.js"
import {positionTool} from "../../../ui/logic/parts/modes/position.js"
import {selectTool} from "../../../ui/logic/parts/modes/select.js"
import {zoomTool} from "../../../ui/logic/parts/modes/zoom.js"
import {prevent_default_browser_behavior} from "./prevent-default-hack.js"

const CUSTOM_PROFILE_LABEL = "Omniclip Custom"

export class Keybindings {
	#running = false
	#request = 0
	#detach

	static async setup(session: OmniSession) {
		const deck = await tact.Deck.load({
			portCount: 1,
			bindings,
			kv: tact.localStorageKv(),
		})
		deck.hub.plug(new tact.PrimaryDevice())
		const port = deck.hub.ports[0]
		port.modes.add("timeline")
		return new Keybindings(deck, session)
	}

	constructor(private deck: tact.Deck<typeof bindings>, private session: OmniSession) {
		this.#detach = prevent_default_browser_behavior(deck)
		this.#running = true
		this.#loop()
	}

	dispose() {
		this.#running = false
		this.#detach()
		if (this.#request)
			cancelAnimationFrame(this.#request)
	}

	getBinding(action: TimelineAction) {
		return this.deck.hub.ports[0].bindings.timeline[action]
	}

	getDefaultBinding(action: TimelineAction) {
		return this.deck.baseBindings.timeline[action]
	}

	async setBinding(action: TimelineAction, atom: Atom) {
		const next = structuredClone(this.deck.hub.ports[0].bindings)
		;(next.timeline as Record<TimelineAction, Atom>)[action] = atom
		this.#replaceBindings(next)
		await this.#persistBindings(next)
	}

	async resetBinding(action: TimelineAction) {
		await this.setBinding(action, structuredClone(this.deck.baseBindings.timeline[action]))
	}

	async resetAll() {
		const next = structuredClone(this.deck.baseBindings)
		const profile = this.#profile
		this.#replaceBindings(next)
		await this.deck.db.assignPortProfile(0, null)
		if (profile)
			await this.deck.db.deleteProfile(profile.id)
	}

	#replaceBindings(next: typeof bindings) {
		const previous = this.deck.hub.ports[0]
		const port = new tact.Port(next)
		port.devices.adds(...previous.devices)
		port.modes.adds(...previous.modes)
		this.deck.hub.ports[0] = port
	}

	async #persistBindings(next: typeof bindings) {
		const profile = this.#profile
		if (!profile) {
			const profile = await this.deck.db.createProfile(CUSTOM_PROFILE_LABEL, next)
			await this.deck.db.assignPortProfile(0, profile.id)
			return
		}

		const catalog = this.deck.catalog.clone()
		catalog.profiles.set(profile.id, {...profile, bindings: next})
		catalog.portProfiles[0] = profile.id
		await this.deck.db.save(catalog)
	}

	get #profile() {
		return [...this.deck.catalog.profiles.values()]
			.find(profile => profile.label === CUSTOM_PROFILE_LABEL)
	}

	#loop = () => {
		if (!this.#running) return

		const [port] = this.deck.hub.poll()

		if (port) {
			const {timeline} = port.actions
			if (timeline.undo.down) this.session.undo()
			if (timeline.redo.down) this.session.redo()
			if (timeline.play_reverse.down) this.session.playback.shuttle(-1)
			if (timeline.pause.down) this.session.playback.pause()
			if (timeline.play_pause.down) this.session.playback.toggle()
			if (timeline.play_forward.down) this.session.playback.shuttle(1)
			if (timeline.step_backward.down) this.session.stepPlayheadFrame(-1)
			if (timeline.step_forward.down) {this.session.stepPlayheadFrame(1)}
			if (timeline.delete_clip.down) this.session.deleteClip(this.session.$selectedItem.value)
			if (timeline.split_clip.down) this.session.splitAtPlayhead()
			if (timeline.zoom_in.down) this.session.viewport.adjustZoomAt(this.session.playheadViewportX(), 0.1)
			if (timeline.zoom_out.down) this.session.viewport.adjustZoomAt(this.session.playheadViewportX(), -0.1)
			if (timeline.zoom_tool.down) this.session.setMode(zoomTool)
			if (timeline.zoom_tool_temp.up) this.session.setMode(selectTool)
			if (timeline.blade_tool.down) this.session.setMode(bladeTool)
			if (timeline.blade_tool_temp.up) this.session.setMode(selectTool)
			if (timeline.position_tool.down) this.session.setMode(positionTool)
			if (timeline.position_tool_temp.up) this.session.setMode(selectTool)
			if (timeline.select_tool.down) this.session.setMode(selectTool)
		}

		this.#request = requestAnimationFrame(this.#loop)
	}
}
