
import {html} from "lit"

import {ProjectCard} from "./card.js"
import {ProjectPreview} from "../constants.js"
import {repeat} from "lit/directives/repeat.js"

export function ProjectGrid(
	items: ProjectPreview[],
	openProject: (id: string) => void,
	openDetails: (event: Event, id: string) => void
) {
	return html`
		<section class="project-grid">
			${repeat(items, project => project.id, project => ProjectCard(project, openProject, openDetails))}
		</section>
	`
}
