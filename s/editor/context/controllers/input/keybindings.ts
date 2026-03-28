import * as tact from "@benev/tact"

import {bindings} from "./bindings.js"
import {OmniSession} from "../../../ui/logic/session.js"
import {bladeTool} from "../../../ui/logic/parts/modes/blade.js"
import {positionTool} from "../../../ui/logic/parts/modes/position.js"
import {selectTool} from "../../../ui/logic/parts/modes/select.js"
import {zoomTool} from "../../../ui/logic/parts/modes/zoom.js"
import {prevent_default_zoom_browser_behavior} from "./prevent-default-hack.js"

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
		this.#detach = prevent_default_zoom_browser_behavior(deck)
		this.#running = true
		this.#loop()
	}

	dispose() {
		this.#running = false
		this.#detach()
		if (this.#request)
			cancelAnimationFrame(this.#request)
	}


	#loop = () => {
		if (!this.#running) return

		const [port] = this.deck.hub.poll()

		if (port) {
			const {timeline} = port.actions
			if (timeline.play_pause.down) console.log("play/Pause timeline")
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

