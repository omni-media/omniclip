
import "@benev/slate/x/node.js"
import {readJson} from "./tools/ssg/read-json.js"
import {template, html, easypage, headScripts, git_commit_hash, read_file, unsanitized, renderSocialCard} from "@benev/turtle"

const domain = "omniclip.app"
const favicon = "/assets/omni.png"

export default template(async basic => {
	const path = basic.path(import.meta.url)
	const hash = await git_commit_hash()

	return easypage({
		path,
		dark: true,
		title: "Omniclip",
		head: html`
			<link rel="icon" href="${favicon}"/>
			<style>${unsanitized(await read_file("x/style.css"))}</style>
			<meta data-commit-hash="${hash}"/>
			<meta data-version="${(await readJson("package.json")).version}"/>

			${renderSocialCard({
				themeColor: "#6d63f2",
				siteName: "omniclip.app",
				title: "Omniclip",
				description: "Free open source video editor for everybody",
				image: `https://${domain}${favicon}`,
				url: `https://${domain}/`,
			})}

			${headScripts({
				devModulePath: await path.version.root("main.bundle.js"),
				prodModulePath: await path.version.root("main.bundle.min.js"),
				importmapContent: await read_file("x/importmap.json"),
			})}
		`,
		body: html`
			<header class=header>Omniclip</header>
			<lettuce-layout></lettuce-layout>
		`,
	})
})

