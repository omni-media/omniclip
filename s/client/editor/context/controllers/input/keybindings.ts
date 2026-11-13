
import {disposer} from "@e280/stz"
import {effect} from "@e280/strata"
import {Decoder, setupTact, type Input, type Inputs} from "@benev/tact"

import {bindings, labels, type ToolAction} from "./bindings.js"
import type {OmniSession} from "../../../ui/logic/session.js"
import {zoomTool} from "../../../ui/logic/parts/modes/zoom.js"
import {handTool} from "../../../ui/logic/parts/modes/hand.js"
import {bladeTool} from "../../../ui/logic/parts/modes/blade.js"
import {selectTool} from "../../../ui/logic/parts/modes/select.js"
import {positionTool} from "../../../ui/logic/parts/modes/position.js"
import {isEditableElement, preventBrowserShortcuts} from "./browser.js"

const tools = {select: selectTool, zoom: zoomTool, blade: bladeTool, position: positionTool, hand: handTool}
const pressed = (input: Input) => input.value > 0 && input.was <= 0
const setupInput = () => setupTact({
	namespace: "omniclip-shortcuts",
	maxPlayers: 1,
	labels,
	presets: {standard: {label: "Omniclip", bindings}},
})

export class Keybindings {
	#request = 0
	#suspended = false
	readonly controller
	#cleanup = disposer()
	#decoder = new Decoder(bindings)
	#temporary?: Exclude<ToolAction, "select">

	static async setup(session: OmniSession) {
		return new Keybindings(await setupInput(), session)
	}

	constructor(readonly tact: Awaited<ReturnType<typeof setupInput>>, private session: OmniSession) {
		const {controller, source} = tact.mouseKeyboard()
		this.controller = controller
		const {controls} = tact.deck
		const activateProfile = (key: string) => { void controls.assignments.assign(controller, key) }
		activateProfile(controls.selectedProfileKey)
		this.#cleanup.schedule(effect(() => controls.selectedProfileKey, activateProfile))
		this.#cleanup.schedule(preventBrowserShortcuts(source, () => controller.bindings, () => this.#disabled()))
		this.#cleanup.schedule(source.onSample(() => this.#poll()))
		this.#loop()
	}

	dispose() {
		cancelAnimationFrame(this.#request)
		this.#cleanup()
		this.tact.dispose()
	}

	suspend() {
		this.#suspended = true
		return () => { this.#suspended = false }
	}

	getBinding(action: ToolAction) {
		const {profiles, assignments} = this.tact.deck.controls
		return profiles.get(assignments.assignedProfileKeyOf(this.controller)).bindings.tools[action]
	}

	#disabled() {
		return this.#suspended || isEditableElement()
	}

	#loop = () => {
		this.#poll()
		this.#request = requestAnimationFrame(this.#loop)
	}

	#poll() {
		const inputs = this.#decoder.decode(this.controller.encode())
		this.#releaseTemporaryTool(inputs.tools)

		if (!this.#disabled()) {
			const playback = inputs.playback
			const editing = inputs.editing
			const timeline = inputs.timeline
			if (pressed(editing.undo)) void this.session.undo()
			if (pressed(editing.redo)) void this.session.redo()
			if (pressed(playback.reverse)) this.session.playback.shuttle(-1)
			if (pressed(playback.pause)) this.session.playback.pause()
			if (pressed(playback.toggle)) this.session.playback.toggle()
			if (pressed(playback.forward)) this.session.playback.shuttle(1)
			if (pressed(timeline.previous)) this.session.stepPlayheadFrame(-1)
			if (pressed(timeline.next)) this.session.stepPlayheadFrame(1)
			if (pressed(editing.delete)) this.session.deleteClip(this.session.$selectedItem())
			if (pressed(editing.split)) this.session.splitAtPlayhead()
			if (pressed(timeline.zoom_in)) this.session.viewport.adjustZoomAt(this.session.playheadViewportX(), 0.1)
			if (pressed(timeline.zoom_out)) this.session.viewport.adjustZoomAt(this.session.playheadViewportX(), -0.1)

			this.#handleToolShortcuts(inputs.tools)
		}
	}

	#releaseTemporaryTool(inputs: Inputs<typeof bindings.tools>) {
		if (this.#temporary && !inputs[`${this.#temporary}_hold`].value) {
			if (this.session.activeMode().id === this.#temporary)
				this.session.setMode(selectTool)
			this.#temporary = undefined
		}
	}

	#handleToolShortcuts(inputs: Inputs<typeof bindings.tools>) {
		for (const name of Object.keys(tools) as ToolAction[]) {
			if (pressed(inputs[name])) this.session.setMode(tools[name])
			if (name !== "select" && pressed(inputs[`${name}_hold`])) {
				this.#temporary = name
				this.session.setMode(tools[name])
			}
		}
	}
}

