
import {html} from "lit"

import {ProjectPreview} from "../constants.js"
import binSvg from "../../../icons/gravity-ui/bin.svg.js"
import playSvg from "../../../icons/gravity-ui/play.svg.js"

export function ProjectDetailsDrawer(
	project: ProjectPreview,
	openProject: (id: string) => void,
	close: () => void
) {

	function DetailRow(label: string, value: string) {
		return html`
			<div>
				<span>${label}</span>
				<strong>${value}</strong>
			</div>
		`
	}

	return html`
		<div class="drawer-layer" @click=${close}>
			<aside class="details-drawer" @click=${(event: Event) => event.stopPropagation()}>
				<header>
					<h2>Project Details</h2>
					<button class="close" title="Close" @click=${close}>×</button>
				</header>

				<div class="drawer-thumbnail" style="background-image: url('${project.thumbnail}')"></div>

				<section class="drawer-summary">
					<h3>${project.title}</h3>
					<p>${project.description}</p>
				</section>

				<div class="drawer-stats">
					${DetailRow('Duration', project.duration)}
					${DetailRow('Resolution', project.resolution)}
					${DetailRow('Aspect ratio', project.aspectRatio)}
					${DetailRow('Frame rate', project.fps)}
					${DetailRow('Last edited', project.edited)}
				</div>

				<div class="drawer-tags">
					${project.tags.map(tag => html`<span>${tag}</span>`)}
				</div>

				<div class="drawer-actions">
					<button class="primary" @click=${() => openProject(project.id)}>${playSvg}<span>Open</span></button>
					<button>Rename</button>
					<button>Duplicate</button>
					<button>Export</button>
					<button>Reveal in folder</button>
					<button class="danger">${binSvg}<span>Delete</span></button>
				</div>
			</aside>
		</div>
	`
}

