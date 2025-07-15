
import {html, Orb} from "@e280/scute"

const domain = "omniclip.app"
const favicon = "/assets/logo/omni.png"

export async function htmlHeaderBoilderplate({orb, css}: {css: string, orb: Orb}) {
	return html`
		<link rel="icon" href="${favicon}"/>
		<style>${orb.inject(await orb.hashurl(`${css}`))}</style>
		<meta data-version="${await orb.packageVersion("$/package.json")}"/>
	`
}

export function htmlSocialCard({title, urlpath}: {
		title: string
		urlpath: string
	}) {
	return {
		title,
		url: `https://${domain}${urlpath}`,
		themeColor: "#6d63f2",
		siteName: "omniclip.app",
		description: "Free open source video editor for everybody",
		image: `https://${domain}${favicon}`,
	}
}
