import {html, shadowView} from "@benev/slate"

import styleCss from "./style.css.js"
import themeCss from "../../../editor/theme.css.js"

export const OpenSource = shadowView(use => () => {
	use.styles(themeCss, styleCss)

	return html`
		<section>
			<h2>Open Source</h2>
			<p class=subtitle>Omniclip is fully open source. Every line of code</br> is public and freely available</p>
			<div class=row>
				<div class=license>
					<span>MIT LICENSE</span>
					<ul>
						<li>Free for personal and commercial use</li>
						<li>Permission to modify and distribute</li>
						<li>No obligation to disclose source</li>
						<li>Comes with no warranty</li>
					</ul>
				</div>
				<div class=text>
					<a href="https://github.com/omni-media/omniclip" target="_blank">
  					<img src="https://img.shields.io/github/stars/omni-media/omniclip?style=social" alt="GitHub stars"/>
					</a>
					<p>
						Every line of code is public - from</br>
						the editor engine to the export</br>
						pipeline. Fork it, audit it, or contribute.</br>
						Built for developers, by developers.
					</p>
					<button><sl-icon name=github></sl-icon>View on GitHub</button>
				</div>
			</div>
		</section>
	`
})
