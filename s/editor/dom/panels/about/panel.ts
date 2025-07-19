
import {html} from "@benev/slate"
import {Salad} from "@e280/lettuce"

import styleCss from "./style.css.js"
import themeCss from "../../../theme.css.js"
import circleInfoSvg from "../../icons/gravity-ui/circle-info.svg.js"

import {EditorContext} from "../../../context/context.js"
import {getMetaVersion} from "../../../../tools/get-meta-version.js"

export const getAboutPanel = (context: EditorContext) => Salad.pan.shadowView({
	label: "about",
	icon: () => circleInfoSvg,

	render: use => () => {
		use.name("about")
		use.styles(themeCss, styleCss)

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

