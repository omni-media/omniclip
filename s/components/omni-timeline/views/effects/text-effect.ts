import {html, css, GoldElement} from "@benev/slate"

import {Effect} from "./parts/effect.js"
import {shadow_view} from "../../../../context/context.js"
import {TextEffect as XTextEffect} from "../../../../context/types.js"

export const TextEffect = shadow_view(use => (effect: XTextEffect, timeline: GoldElement) => {
	const controller = use.context.controllers.timeline

	return html`${Effect([timeline, effect, html``, css``, `
		${!controller.get_effects_on_track(use.context.state, effect.track)
			.some(effect => effect.kind !== "text")
			? `height: 30px;`
			: ""}
			background-color: ${effect.color};
	`])}`
})
