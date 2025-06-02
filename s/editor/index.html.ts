
import "@benev/slate/x/node.js"
import {template, html, easypage} from "@benev/turtle"
import {htmlHeaderBoilderplate, htmlHeaderScripts, htmlSocialCard} from "../website/ssg/html-commons.js"

export default template(async basic => {
	const path = basic.path(import.meta.url)

	return easypage({
		path,
		dark: true,
		title: "Omniclip Editor",
		head: html`
			${await htmlHeaderBoilderplate({css: "editor/editor.css"})}

			${htmlSocialCard({
				title: "Omniclip Editor",
				urlpath: "/editor/",
			})}

			${htmlHeaderScripts({
				path,
				mainDev: "editor/editor.bundle.js",
				mainProd: "editor/editor.bundle.min.js",
			})}
		`,
		body: html`
			<header class=header>Omniclip</header>
			<lettuce-layout></lettuce-layout>
		`,
	})
})

