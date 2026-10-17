
import {html} from "lit"
import {shadow, useCss, useName, useOnce} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../../../theme.css.js"
import {getMetaVersion} from "../../../../tools/get-meta-version.js"

export const AboutPage = shadow(() => {
	useName("about")
	useCss(themeCss, styleCss)

	const version = useOnce(() => getMetaVersion())

	return html`
		<header theme=topper></header>

		<section theme=paddy>
			<img alt="" src="/assets/logo/omni.avif"/>
			<h2>
				<strong>Omniclip</strong>
				<small>v${version}</small>
			</h2>
		<section>
	`
})
