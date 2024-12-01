import {html} from "@benev/slate"
import {standard_panel_styles as styles, panel} from "@benev/construct"

import {ProjectImport} from "./view.js"
import {shadow_view} from "../../context/context.js"
import importSvg from "../../icons/carbon-icons/document-import.svg.js"

export const ProjectImportPanel = panel({
	label: "Import",
	icon: importSvg,
	view: shadow_view(use => ({}: any) => {
		use.styles(styles)
		use.name("Import")
		return html`
			${ProjectImport([])}
		`
	}),
})
