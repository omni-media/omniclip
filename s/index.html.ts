
import {html, ssg} from "@e280/scute"
import {constants} from "./constants.js"
import {socialCard} from "./website/social-card.js"

export default ssg.page(import.meta.url, async orb => {
	const title = "Omniclip"

	return ({
		title,
		css: "style.css",
		js: "main.bundle.min.js",
		favicon: constants.favicon,
		dark: true,
		socialCard: socialCard(title),
		head: html`
			<meta data-version="${await orb.packageVersion("$/package.json")}"/>
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/themes/dark.css">
			<script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/shoelace.js"></script>
		`,
		body: html`
			<landing-page></landing-page>
		`,
	})
})

