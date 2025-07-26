import {html, shadowView} from "@benev/slate"

import styleCss from "./style.css.js"
import themeCss from "../../../editor/theme.css.js"

export const Hero = shadowView(use => () => {
	use.styles(themeCss, styleCss)

	return html`
		<section class="hero">
			<div class="hero-background"></div>

			<div class="hero-content">
				<h1 class="omniclip-title">
					<img src="/assets/icon3.png" />
					<span class="version-tag">v2.0.0-4</span>
				</h1>
				<div class="subheadline">
					<p class="tagline">Video editing. Reimagined for the web.</p>
					Open-source, privacy-focused, runs everywhere.<br>
					All your data stays on your device.
				</div>
				<div class="buttons">
					<a href="#/editor" class="btn editor">
						Open Editor
					</a>
					<a href="https://discord.gg/Nr8t9s5wSM" class="btn discord" target="_blank">
						<sl-icon name="discord"></sl-icon>
						Join Discord
					</a>
				</div>
			</div>
		</section>
	`
})

