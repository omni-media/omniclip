
import "@benev/slate/x/node.js"
import {html, ssg} from "@e280/scute"

import {htmlHeaderBoilderplate, htmlSocialCard} from "./website/ssg/html-commons.js"

export default ssg.page(import.meta.url, async orb => {
	const path = orb.path(import.meta.url)
	const version = await orb.packageVersion()

	return ({
		path,
		dark: true,
		title: "Omniclip",
		head: html`
			${await htmlHeaderBoilderplate({orb, css: "./style.css"})}
			<script type="module" src="${orb.hashurl("main.bundle.min.js")}"></script>
		`,
		socialCard: htmlSocialCard({
			title: "Omniclip",
			urlpath: "/",
		}),
		body: html`
			<section class=lead>
				<div class=logobox>
					<img class=logo alt="" src="/assets/logo/omni.avif"/>
				</div>
				<div class=contentbox>
					<h1>Omniclip <span>v${version}</span></h1>
					<p><a href="/editor/">Launch Editor</a></p>
					<p><a href="https://github.com/omni-media/omniclip">github.com/omni-media/omniclip</a></p>
				</div>
			</section>
		`,
	})
})

