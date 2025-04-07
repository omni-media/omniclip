
import {html} from "@benev/slate"
import {Salad} from "@e280/lettuce"

import {styles} from "./styles.js"
import {getMetaVersion} from "../../../tools/get-meta-version.js"
import circleInfoSvg from "../../icons/gravity-ui/circle-info.svg.js"

export const AboutPanel = Salad.pan.shadowView({
	label: "about",
	icon: () => circleInfoSvg,

	render: use => () => {
		use.name("about")
		use.styles(styles)
		const version = use.once(() => getMetaVersion())

		return html`
			<div class=plate>
				<img alt="" src="/assets/logo/omni.avif"/>
				<h2><span>Omniclip</span> <span>v${version}</span></h2>
				<p>a new horizon</p>
			<div>
		`
	},
})

