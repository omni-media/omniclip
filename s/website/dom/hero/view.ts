
import {html} from "lit"
import {shadow, useCss} from "@e280/sly"

import styleCss from "./style.css.js"
import discordSvg from "../../../editor/ui/icons/remix-icon/discord.svg.js"

const github = "https://github.com/omni-media/omniclip"
const discord = "https://discord.gg/Nr8t9s5wSM"

export const Hero = shadow(() => {
	useCss(styleCss)
	const version = document.querySelector("meta[data-version]")?.getAttribute("data-version")

	return html`
		<main>
			<nav>
				<a class="brand" href="/">
					<img src="/assets/logo/omni.png" alt="" />
					<span>omniclip</span>
					${version ? html`<small class="version">v${version}</small>` : null}
				</a>

				<div class="nav-actions">
					<a class="github" href=${github} target="_blank" rel="noreferrer">View on GitHub ↗</a>
				</div>
			</nav>

			<section class="hero">
				<div class="copy">
					<h1>A video editor that runs in your browser.</h1>
					<p>Cut, compose, and export without leaving your browser.</p>

					<div class="actions">
						<a class="primary" href="/editor/#/projects">Open the editor</a>
						<a class="discord" href=${discord} target="_blank" rel="noreferrer">
							${discordSvg} Join Discord
						</a>
					</div>
				</div>

				<figure class="editor">
					<img
						src="/assets/landing-editor-hero.png"
						alt="Omniclip editing a cinematic video with a layered timeline and audio mixer"
					/>
				</figure>

				<footer class="credit">
					Built by
					<a href="https://github.com/zenkyuv" target="_blank" rel="noreferrer">Przemek Gałęzki</a>
				</footer>
			</section>
		</main>
	`
})

