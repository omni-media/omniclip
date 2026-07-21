
import {dom} from "@e280/sly"
import * as tact from "@benev/tact"
import type {Atom, Mods} from "@benev/tact"

import {bindings} from "./bindings.js"

function activeElement() {
	let element = document.activeElement
	while (element?.shadowRoot?.activeElement)
		element = element.shadowRoot.activeElement
	return element
}

export function isEditableElement(element = activeElement()) {
	return element instanceof HTMLElement && element.matches([
		"input",
		"textarea",
		"select",
		"[contenteditable]",
		"wa-input",
		"wa-textarea",
		"wa-select",
		"wa-number-input",
	].join(", "))
}

function codePressed(event: KeyboardEvent, pressed: Set<string>, code: string) {
	switch (code) {
		case "ControlLeft":
		case "ControlRight":
			return event.ctrlKey
		case "AltLeft":
		case "AltRight":
			return event.altKey
		case "MetaLeft":
		case "MetaRight":
			return event.metaKey
		case "ShiftLeft":
		case "ShiftRight":
			return event.shiftKey
		default:
			return event.code === code || pressed.has(code)
	}
}

function matchesBinding(event: KeyboardEvent, pressed: Set<string>, binding: Atom): boolean {
	if (typeof binding === 'string')
		return codePressed(event, pressed, binding)

	switch (binding[0]) {
		case 'and':
			return binding.slice(1).every(atom => matchesBinding(event, pressed, atom))
		case 'or':
			return binding.slice(1).some(atom => matchesBinding(event, pressed, atom))
		case 'not':
			return !matchesBinding(event, pressed, binding[1])
		case 'cond':
			return matchesBinding(event, pressed, binding[2]) && matchesBinding(event, pressed, binding[1])
		case 'mods':
			return matchesMods(event, pressed, binding)
		case 'code':
			return codePressed(event, pressed, binding[1])
		default:
			return false
	}
}

function matchesMods(event: KeyboardEvent, pressed: Set<string>, binding: Mods) {
	const [, subject, mods] = binding
	const maybe = (value: boolean, ...codes: string[]): Atom =>
		value
			? ["or", ...codes]
			: ["not", ["or", ...codes]]

	return matchesBinding(event, pressed, [
		'cond',
		subject,
		['and',
			maybe(mods.ctrl ?? false, 'ControlLeft', 'ControlRight'),
			maybe(mods.alt ?? false, 'AltLeft', 'AltRight'),
			maybe(mods.meta ?? false, 'MetaLeft', 'MetaRight'),
			maybe(mods.shift ?? false, 'ShiftLeft', 'ShiftRight'),
		]
	])
}

export const prevent_default_browser_behavior = (deck: tact.Deck<typeof bindings>) => {
	const pressed = new Set<string>()

	return dom.events(window, {
		keydown: (event: KeyboardEvent) => {
			pressed.add(event.code)
			if (isEditableElement())
				return

			const timeline = deck.hub.portByIndex(0).bindings.timeline
			if (
				matchesBinding(event, pressed, timeline.undo) ||
				matchesBinding(event, pressed, timeline.redo) ||
				matchesBinding(event, pressed, timeline.zoom_in) ||
				matchesBinding(event, pressed, timeline.zoom_out) ||
				matchesBinding(event, pressed, timeline.step_backward) ||
				matchesBinding(event, pressed, timeline.step_forward)
			) {
				event.preventDefault()
			}
		},
		keyup: (event: KeyboardEvent) => {
			pressed.delete(event.code)
		},
		blur: () => {
			pressed.clear()
		}
	})
}

