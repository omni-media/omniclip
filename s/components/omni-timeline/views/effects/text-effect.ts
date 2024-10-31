import {html, css, GoldElement} from "@benev/slate"

import {Effect} from "./parts/effect.js"
import {shadow_view} from "../../../../context/context.js"
import {TextEffect as XTextEffect} from "../../../../context/types.js"
import {getEffectsOnTrack} from "../../../../context/controllers/timeline/utils/get-effects-on-track.js"

export const TextEffect = shadow_view(use => (effect: XTextEffect, timeline: GoldElement) => {

	return html`${Effect([timeline, effect, html``, css``, `
		${!getEffectsOnTrack(use.context.state, effect.track)
			.some(effect => effect.kind !== "text")
			? `height: 30px;`
			: ""}
			background-color: ${effect.color};
	`])}`
})
