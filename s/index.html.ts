
import "@benev/slate/x/node.js"
import {template, html, easypage} from "@benev/turtle"

import {htmlHeaderBoilderplate, htmlHeaderScripts, htmlSocialCard} from "./website/ssg/html-commons.js"

export default template(async basic => {
	const path = basic.path(import.meta.url)

	return easypage({
		path,
		dark: true,
		title: "Omniclip",
		head: html`
			${await htmlHeaderBoilderplate({css: "style.css"})}

			${htmlSocialCard({
				title: "Omniclip",
				urlpath: "/",
			})}

			${htmlHeaderScripts({
				path,
				mainDev: "main.bundle.js",
				mainProd: "main.bundle.min.js",
			})}
		`,
		body: html`
			<h1>Omniclip</h1>
			<p><a href="/editor/">Launch Editor</a></p>
			<p><a href="https://github.com/omni-media/omniclip">github.com/omni-media/omniclip</a></p>
		`,
	})
})

