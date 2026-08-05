import {html} from "lit"

import {ProjectPreview} from "../constants.js"
import playSvg from "../../../icons/gravity-ui/play.svg.js"
import infoSvg from "../../../icons/gravity-ui/circle-info.svg.js"

export function FeaturedProject(
	project: ProjectPreview,
	openProject: (id: string) => void,
	openDetails: (event: Event, id: string) => void,
) {
	return html`
		<section class="featured-project" style="background-image: url('${project.thumbnail}')">
			<div class="featured-copy">
				<span class="eyebrow">Continue editing</span>
				<h1>${project.title}</h1>
				<p>${project.description}</p>

				<div class="featured-meta">
					<span>${project.duration}</span>
					<span>${project.resolution}</span>
					<span>${project.fps}</span>
					<span>${project.edited}</span>
				</div>

				<div class="featured-actions">
					<button class="hero-button primary" @click=${() => openProject(project.id)}>
						${playSvg}<span>Open project</span>
					</button>
					<button class="hero-button" @click=${(event: Event) => openDetails(event, project.id)}>
						${infoSvg}<span>Details</span>
					</button>
				</div>
			</div>
		</section>
	`
}
