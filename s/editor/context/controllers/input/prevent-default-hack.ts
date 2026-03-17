
import {dom} from "@e280/sly"
import * as tact from "@benev/tact"

import {bindings} from "./bindings.js"

type BindingAtom =
	| string
	| ["or", ...BindingAtom[]]
	| ["mods", string, Partial<{ctrl: boolean, alt: boolean, shift: boolean, meta: boolean}>]
	| ["code", string, unknown?]

type ModsBinding = ["mods", string, Partial<{ctrl: boolean, alt: boolean, shift: boolean, meta: boolean}>]

function matchesBinding(event: KeyboardEvent, binding: BindingAtom): boolean {
	if (typeof binding === 'string')
		return event.code === binding

	switch (binding[0]) {
		case 'or':
			return binding.slice(1).some(atom => matchesBinding(event, atom))
		case 'mods':
			return matchesMods(event, binding)
		case 'code':
			return event.code === binding[1]
		default:
			return false
	}
}

function matchesMods(event: KeyboardEvent, binding: ModsBinding) {
	const [, code, mods] = binding
	return (
		event.code === code &&
		event.ctrlKey === !!mods.ctrl &&
		event.altKey === !!mods.alt &&
		event.shiftKey === !!mods.shift &&
		event.metaKey === !!mods.meta
	)
}

export const prevent_default_zoom_browser_behavior = (deck: tact.Deck<typeof bindings>) => dom.events(window, {
	keydown: (event: KeyboardEvent) => {
		const timeline = deck.hub.portByIndex(0).bindings.timeline
		if (
			matchesBinding(event, timeline.zoom_in) ||
			matchesBinding(event, timeline.zoom_out)
		) {
			event.preventDefault()
		}
	}
})

