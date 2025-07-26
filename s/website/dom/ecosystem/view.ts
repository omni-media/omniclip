import {html, shadowView} from "@benev/slate"

import styleCss from "./style.css.js"
import themeCss from "../../../editor/theme.css.js"

export const Ecosystem = shadowView(use => () => {
	use.styles(themeCss, styleCss)

	return html`
		<section class="ecosystem">
			<h2>The Omniclip Ecosystem</h2>
			<p class="subtitle">
				It's not just a video editor, it's a whole ecosystem that powers it.<br>
			</p>
			<div class=libraries>
				<div>
					<h3 class=group-title><img src="/assets/omnistudio.png"/>@omnistudio</h3>
					<p class="subtitle">
						Check out our <a href="https://github.com/@omni-studio" target="_blank">GitHub (@omni-studio)</a>.
					</p>
					<div class="ecosystem-grid">
						<a class="eco-item" href="https://github.com/omni-media/omnitool" target="_blank" >
							<h3>Omnitool</h3>
							<p>Composable timeline & media engine. Declarative, flexible, and format-agnostic.</p>
						</a>
						<a class="eco-item" href="https://github.com/omni-media/webm-hero" target="_blank">
							<h3>webm-hero</h3>
							<img class="item-background" src="/assets/webmhero.png" />
							<p>VP8/VP9 WebAssembly decoder using libvpx</p>
						</a>
					</div>
				</div>
				<div>
					<h3 class=group-title><img src="/assets/e280.avif"/>@e280</h3>
					<p class="subtitle">
						<span class="credit">(credits to @Chase)</span><br>
						Check out our <a href="https://e280.org/" target="_blank">website (@e280)</a> or <a href="https://discord.gg/your-invite" target="_blank">join our Discord</a>.
					</p>
					<div class="ecosystem-grid">
						<a class="eco-item" href="https://github.com/e280/quay" target="_blank">
							<h3>
								<img class="item-icon" src="/assets/quay.png" />
								Quay
							</h3>
							<img class="item-background" src="/assets/quay.png" />
							<p>Powerful tree and media browser UI with filtering, dropzones, and permission models.</p>
						</a>
						<a class="eco-item" href="https://github.com/e280/comrade" target="_blank">
							<h3>
								<span>🤖</span> Comrade
							</h3>
							<img class="item-background" src="/assets/comrade.avif" />
							<p>Thread manager for workers, streaming messages, and lifecycle orchestration.</p>
						</a>
						<a class="eco-item" href="https://github.com/e280/scute" target="_blank">
							<h3>
								<span>🐢</span> Scute
							</h3>
							<img class="item-background" src="/assets/scute.jpg" />
							<p>scute is little static site generator and build tool for websites and web apps.</p>
						</a>
						<a class="eco-item" href="https://github.com/e280/science" target="_blank">
							<h3>
								<span>🧪</span> Science
							</h3>
							<img class="item-background" src="/assets/science.png" />
							<p>minimalist ts/js testing framework</p>
						</a>
						<a class="eco-item" href="https://github.com/e280/strata" target="_blank">
							<h3>
								<span>⛏️</span> Strata
							</h3>
							<img class="item-background" src="/assets/strata.jpg" />
							<p>State management library</p>
						</a>
						<a class="eco-item" href="https://github.com/e280/stz">
							<h3>
								stz
							</h3>
							<p>everyday ts fns we use everywhere </p>
						</a>
						<a class="eco-item" href="https://github.com/benevolent-games/slate" target="_blank">
							<h3>
								🪨 Slate
							</h3>
							<img class="item-background" src="/assets/slate.webp" />
							<p>Frontend framework</p>
						</a>
						<a class="eco-item" href="https://github.com/benevolent-games/sparrow" target="_blank">
							<h3>
								🐦 Sparrow-RTC
							</h3>
							<img class="item-background" src="/assets/sparrow.png" />
							<p>WebRTC made easy </p>
						</a>
						<a class="eco-item" href="https://github.com/e280/renraku" target="_blank">
							<h3>
								⛩️ Renraku
							</h3>
							<img class="item-background" src="/assets/renraku1.png" />
							<p>make beautiful typescript apis</p>
						</a>
					</div>
				</div>
			</div>
		</section>
`
})
