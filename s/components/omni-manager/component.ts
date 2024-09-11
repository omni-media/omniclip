import {LitElement} from "lit"
import {html} from "@benev/slate"
import {property} from "lit/decorators.js"

import {styles} from "./styles.js"
import addSvg from "../../icons/gravity-ui/add.svg.js"
import {HistoricalState} from "../../context/types.js"
import binSvg from "../../icons/gravity-ui/bin.svg.js"
import {removeLoadingPageIndicator} from "../../main.js"
import {generate_id} from "@benev/slate/x/tools/generate_id.js"
import circlePlaySvg from "../../icons/gravity-ui/circle-play.svg.js"
import {calculateProjectDuration} from "../../utils/calculate-project-duration.js"
import {convert_ms_to_hms} from "../omni-timeline/views/time-ruler/utils/convert_ms_to_hms.js"

export class OmniManager extends LitElement {
	static styles = styles

	@property()
	projects: HistoricalState[] = []

	loadProjectsFromStorage() {
		const prefix = 'omniclip_'
		for (const key in localStorage) {
			if (key && key.startsWith(prefix)) {
				const storedData = localStorage.getItem(key)
				if (storedData) {
					try {
						const projectKey = key.replace(prefix, '')
						const project = storedData ? JSON.parse(storedData) as HistoricalState : undefined
						const oldStorage = projectKey === "effects" || projectKey === "tracks"
						if(project && !oldStorage) {
							this.projects = [...this.projects, project]
						}
					} catch (error) {
						return undefined
					}
				}
			}
		}
	}

	removeProject(projectId: string, prefix: string) {
		localStorage.removeItem(prefix + projectId)
		this.projects = []
		this.loadProjectsFromStorage()
		this.requestUpdate()
	}

	connectedCallback() {
		super.connectedCallback()
		this.loadProjectsFromStorage()
		removeLoadingPageIndicator()
	}

	render() {
		return html`<div class="box">
			<h1>Your projects</h1>
			<div class="projects">
				<a href="#/editor/${generate_id()}" class="new-project">${addSvg}</a>
				${this.projects.map(project => html`
					<div class="project">
						<button class="remove"><span @click=${() => this.removeProject(project.projectId, "omniclip_")} class="icon">${binSvg}<span></button>
						<span class="duration">${project.effects.length === 0 ? 0 : convert_ms_to_hms(calculateProjectDuration(project.effects))}s</span>
						<a href="#/editor/${project.projectId}"class="open">${circlePlaySvg}</a>
						<span class="project-name">${project.projectName}</span>
					</div>
				`)}
			</div>
		</div>
	`}
}
