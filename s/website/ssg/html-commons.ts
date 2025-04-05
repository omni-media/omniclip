
import {git_commit_hash, headScripts, html, PathRouter, read_file, renderSocialCard, unsanitized} from "@benev/turtle"
import {readJson} from "./read-json.js"

const domain = "omniclip.app"
const favicon = "/assets/logo/omni.png"

export async function htmlHeaderBoilderplate({css}: {css: string}) {
	const hash = await git_commit_hash()
	return html`
		<link rel="icon" href="${favicon}"/>
		<style>${unsanitized(await read_file(`x/${css}`))}</style>
		<meta data-commit-hash="${hash}"/>
		<meta data-version="${(await readJson("package.json")).version}"/>
	`
}

export function htmlSocialCard({title, urlpath}: {
		title: string
		urlpath: string
	}) {
	return renderSocialCard({
		title,
		url: `https://${domain}${urlpath}`,
		themeColor: "#6d63f2",
		siteName: "omniclip.app",
		description: "Free open source video editor for everybody",
		image: `https://${domain}${favicon}`,
	})
}

export async function htmlHeaderScripts({path, mainDev, mainProd}: {
		path: PathRouter
		mainDev: string
		mainProd: string
	}) {
	return headScripts({
		devModulePath: await path.version.root(mainDev),
		prodModulePath: await path.version.root(mainProd),
		importmapContent: await read_file("x/importmap.json"),
	})
}

