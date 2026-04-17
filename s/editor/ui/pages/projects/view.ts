
import {html} from "lit"
import {shadow, useCss, useName} from "@e280/sly"
import styleCss from "./style.css.js"
import themeCss from "../../../theme.css.js"
import {EditorContext} from "../../../context/context.js"

export const ProjectsPage = (context: EditorContext) => shadow(() => {
	useName("projects")
	useCss(themeCss, styleCss)

	return html`
		<header theme=topper></header>

		<div theme=paddy>
			<h1>Projects</h1>
			<p>The project browser will be here.</p>
		<div>
	`
})
