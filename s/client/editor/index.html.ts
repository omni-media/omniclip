
import {html, template, utf8, viewport, darkreaderDisable, favicon, socialCard as renderSocialCard} from "@e280/scute"
import {constants} from "../constants.js"
import {socialCard} from "../website/social-card.js"

export default template(import.meta.url, async orb => {
	const title = "Omniclip Editor"

	return html`
		<!doctype html>
		<html>
		<head>
			${utf8()}
			${viewport()}
			${darkreaderDisable()}
			<title>${title}</title>
			<style>${await orb.inject("editor.css")}</style>
			<script type="module" src="${orb.hashurl("editor.bundle.min.js")}"></script>
			${favicon(await orb.hashurl(`..${constants.favicon}`))}
			${renderSocialCard(socialCard(title))}
			<meta data-version="${await orb.packageVersion("$/package.json")}"/>
			<script>document.documentElement.classList.add("wa-dark")</script>
			<script>document.documentElement.classList.add("sl-theme-dark")</script>
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/themes/dark.css">
			<script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/shoelace.js"></script>
		</head>
		<body>
			<editor-app></editor-app>
		</body>
		</html>
	`
})

