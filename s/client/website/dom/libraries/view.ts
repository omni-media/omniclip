
import {html} from "lit"
import {shadow, useCss} from "@e280/sly"

import styleCss from "./style.css.js"

export const Libraries = shadow(() => {
	useCss(styleCss)

	return html`
		<section>
			<div class="label">What it's built on</div>

			<p>Libraries built by me and my friend that power omniclip:</p>

			<div class="lib-block">
				<span class="lib-icon lib-icon-emoji" aria-hidden="true">🧰</span>
				<div class="lib-body">
					<a class="lib-name" href="https://github.com/omni-media/omnitool" target="_blank" rel="noreferrer">
						@omnimedia/omnitool
					</a>
					<div class="lib-desc">
						The playback and processing engine. Handles decoding, frame stepping, the J/K/L heartbeat,
						and timeline state. It's what makes the editor actually run, extracted so it can be used
						independently of the UI.
					</div>
				</div>
			</div>

			<div class="lib-block">
				<img class="lib-icon lib-icon-image" src="/assets/e280.avif" alt="" />
				<div class="lib-body">
					<a class="lib-name" href="https://github.com/e280" target="_blank" rel="noreferrer">
						@e280
					</a>
					<div class="lib-desc">
						A collection of lower-level utilities covering effects, local state, storage,
						and UI infrastructure. The unglamorous parts that make the glamorous parts possible.
					</div>
				</div>
			</div>

		</section>
	`
})

