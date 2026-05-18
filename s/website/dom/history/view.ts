
import {html} from "lit"
import {shadow, useCss} from "@e280/sly"

import styleCss from "./style.css.js"

export const History = shadow(() => {
	useCss(styleCss)

	return html`
		<section>
			<div class="label">A bit of history</div>

			<p>
				Omniclip started as a hobby project. I wanted to build something harder than the
				usual portfolio app, and a browser-based video editor sounded just difficult enough
				to be interesting.
			</p>

			<p>
				After about six months, I shared it on Hacker News because why not. The
				<a href="https://news.ycombinator.com/item?id=40331968" target="_blank" rel="noreferrer">
					Show HN post
				</a>
				ended up getting far more attention than I expected, and that changed how I thought
				about the project.
			</p>

			<p>
				v2 is the result of taking that rough prototype seriously: I started omniclip from scratch,
				the video processing engine got pulled out into its own library, and omniclip was built around
				better architecture, and everything is more thought out to be robust and not mvp like.<br>
				As the saying goes, something has to be done 3 times to be actually good, or something like that ?

			</p>
		</section>
	`
})

