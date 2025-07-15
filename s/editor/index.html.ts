
import "@benev/slate/x/node.js"
import {ssg, html} from "@e280/scute"
import {htmlHeaderBoilderplate, htmlSocialCard} from "../website/ssg/html-commons.js"

export default ssg.page(import.meta.url, async orb => {
	const path = orb.path(import.meta.url)

	return ({
		path,
		dark: true,
		title: "Omniclip Editor",
		head: html`
			${await htmlHeaderBoilderplate({orb, css: "./editor.css"})}
			<script type="module" src="${orb.hashurl("editor.bundle.min.js")}"></script>
		`,
		socialCard: htmlSocialCard({
			title: "Omniclip Editor",
			urlpath: "/editor/",
		}),
		body: html`
			<header class=header>Omniclip</header>
			<lettuce-layout></lettuce-layout>
		`,
	})
})

