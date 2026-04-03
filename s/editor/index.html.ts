
import {ssg, html} from "@e280/scute"
import {constants} from "../constants.js"
import {socialCard} from "../website/social-card.js"

export default ssg.page(import.meta.url, async orb => {
	const title = "Omniclip Editor"

	return ({
		title,
		css: "editor.css",
		js: "editor.bundle.min.js",
		favicon: constants.favicon,
		dark: true,
		socialCard: socialCard(title),
		head: html`
			<meta data-version="${await orb.packageVersion("$/package.json")}"/>
			<script>document.documentElement.classList.add("wa-dark")</script>
		`,
		body: html`
			<editor-app></editor-app>
		`,
	})
})

