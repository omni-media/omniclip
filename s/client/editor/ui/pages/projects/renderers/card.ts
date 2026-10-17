
import {html} from "lit"

import {ProjectPreview} from "../constants.js"
import {TimelineStrip} from "./timeline.js"
import starSvg from "../../../icons/gravity-ui/star.svg.js"

export function ProjectCard(
	project: ProjectPreview,
	openProject: (id: string) => void,
	openDetails: (event: Event, id: string) => void
) {
	return html`
		<article class="project-card" @click=${() => openProject(project.id)}>
			<div class="thumbnail" style="background-image: url('${project.thumbnail}')">
				<span class="duration">${project.duration}</span>
				<button class="overflow" title="Project details" @click=${(event: Event) => openDetails(event, project.id)}>•••</button>
			</div>

			<div class="project-body">
				<div class="project-title">
					<h2>${project.title}</h2>
					${project.favorite ? html`<span class="favorite">${starSvg}</span>` : null}
				</div>

				<div class="metadata">
					<span>${project.resolution}</span>
					<span>${project.aspectRatio}</span>
					<span>${project.fps}</span>
				</div>

				<div class="edited">${project.edited}</div>
				${TimelineStrip(project.timeline)}
			</div>
		</article>
	`
}

