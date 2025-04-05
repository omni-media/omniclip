
import {html, shadowView} from "@benev/slate"
import {panel, PanelProps} from "@e280/lettuce"

import {styles} from "./styles.js"
import {getMetaVersion} from "../../../tools/get-meta-version.js"
import circleInfoSvg from "../../icons/gravity-ui/circle-info.svg.js"

export const AboutPanel = panel({
	label: "about",
	icon: circleInfoSvg,

	view: shadowView(use => ({}: PanelProps) => {
		use.name("about")
		use.styles(styles)

		const version = use.once(() => getMetaVersion())

		return html`
			<div class=plate>
				<h2><span>Omniclip</span> <span>v${version}</span></h2>
				<p>a new horizon</p>
			<div>
		`
	}),
})

