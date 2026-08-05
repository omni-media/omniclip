
import {html} from "lit"

import {ProjectCard} from "./card.js"
import {ProjectPreview, ViewMode} from "../constants.js"
import {repeat} from "lit/directives/repeat.js"

export function ProjectGrid(
	items: ProjectPreview[],
	openProject: (id: string) => void,
	openDetails: (event: Event, id: string) => void,
	viewMode: ViewMode,
) {
	return html`
		<section class="project-grid ${viewMode}">
			${repeat(items, project => project.id, project => ProjectCard(project, openProject, openDetails))}
		</section>
	`
}
