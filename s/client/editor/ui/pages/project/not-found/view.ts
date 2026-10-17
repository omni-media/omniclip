
import {html} from "lit"
import {shadow, useCss, useName} from "@e280/sly"

import styleCss from "./style.css.js"
import type {AppRouter} from "../../router.js"
import themeCss from "../../../../theme.css.js"

export const ProjectNotFoundPage = shadow((router: AppRouter, projectId: string) => {
	useName("project-not-found")
	useCss(themeCss, styleCss)

	return html`
		<header theme=topper></header>

		<section class="project-not-found">
			<h1>Project not found</h1>
			<p>No local project exists with id "${projectId}". It may have been deleted, renamed, or opened from an old link.</p>
			<a href=${router.href.projects()}>Back to projects</a>
		</section>
	`
})

