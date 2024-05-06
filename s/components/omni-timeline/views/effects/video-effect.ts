import {html, GoldElement} from "@benev/slate"

import {Effect} from "./parts/effect.js"
import {Filmstrips} from "../filmstrips/view.js"
import {shadow_view} from "../../../../context/slate.js"
import {VideoEffect as XVideoEffect} from "../../../../context/controllers/timeline/types.js"

export const VideoEffect = shadow_view(use => (effect: XVideoEffect, timeline: GoldElement) => {
	return html`${Effect([effect, html`${Filmstrips([effect, timeline])}`])}`
})
