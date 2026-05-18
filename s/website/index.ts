
import {html, css} from "lit"
import {shadowElement, useCss, useShadow} from "@e280/sly"

import {Hero} from "./dom/hero/view.js"
import {Footer} from "./dom/footer/view.js"
import {Github} from "./dom/github/view.js"
import {History} from "./dom/history/view.js"
import {Features} from "./dom/features/view.js"
import {Libraries} from "./dom/libraries/view.js"

export const landingPage = shadowElement(() => {
	useCss(css`:host {
		display: block;
		min-height: 100%;
		background: var(--bg);
		color: #ccc;
		font-family: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
		font-weight: 300;
		font-size: var(--font-size-m);
		line-height: 1.7;
		width: 100%;
	}

	main {
		max-width: 41em;
		margin: 0 auto;
		padding: 0 1.5em 7.5em;
	}

	.divider {
		border: none;
		border-top: 1px solid #1c1c1c;
		margin: 3.5em 0;
	}

	#features {
		padding-top: 7em;
	}

	#features::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -1px;
		height: 7.5em;
		background: linear-gradient(
			to bottom,
			rgba(30, 41, 59, 0),
			#111
		);
		pointer-events: none;
	}

	.final-cta {
		margin-top: 7em;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: #e8a020;
		color: #111;
		padding: 0.6em 1.4em;
		font-family: "IBM Plex Mono", ui-monospace, monospace;
		font-size: calc(var(--font-size-s) - 1px);
		line-height: 1.2;
		text-decoration: none;
		white-space: nowrap;
		transition: opacity 0.15s;
	}

	.final-cta:hover {
		opacity: 0.85;
		text-decoration: none;
	}

	@media (max-width: 500px) {
		main {
			padding: 3.5em 1.3em 6em;
		}
	}
	`)

	const shadow = useShadow()

	const getSection = (id: string) => {
		return shadow.querySelector<HTMLElement>(`#${id}`) ?? undefined
	}

	return html`
		<main>
			${Hero(getSection)}
			<section id="features">
				${Features()}
			</section>
			<hr class="divider">
			<section id="source">
				${Github()}
			</section>
			<hr class="divider">
			<section id="history">
				${History()}
			</section>
			<hr class="divider">
			${Libraries()}
			<a href="#/editor" class="final-cta">Open Omniclip -&gt;</a>
			${Footer()}
		</main>
	`
})

