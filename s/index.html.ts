
import {html, ssg} from "@e280/scute"
import {constants} from "./constants.js"
import {socialCard} from "./website/social-card.js"

export default ssg.page(import.meta.url, async orb => {
	const title = "Omniclip"
	const version = await orb.packageVersion()

	return ({
		title,
		css: "style.css",
		js: "main.bundle.min.js",
		favicon: constants.favicon,
		dark: true,
		socialCard: socialCard(title),
		head: html`
			<meta data-version="${await orb.packageVersion("$/package.json")}"/>
		`,
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

