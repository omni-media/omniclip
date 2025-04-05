import {html} from "@benev/slate"
import {standard_panel_styles as styles, panel} from "@benev/construct"

// import {MediaPlayer} from "./view.js"
import {shadow_view} from "../../../../context/context.js"
import exportSvg from "../../../../icons/gravity-ui/export.svg.js"
import { Export } from "./view.js"
export const ExportPanel = panel({
	label: "Export",
	icon: exportSvg,
	view: shadow_view(use => ({}: any) => {
		use.styles(styles)
		use.name("export")
		return html`${Export([])}`
	}),
})
