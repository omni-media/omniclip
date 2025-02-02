import {LitElement, html} from "lit"
import {TemplateResult} from "@benev/slate"
import {property} from "lit/decorators.js"

import {styles} from "./styles.js"
import loadingSvg from "../../icons/loading.svg.js"
import addSvg from "../../icons/gravity-ui/add.svg.js"
import {HistoricalState} from "../../context/types.js"
import binSvg from "../../icons/gravity-ui/bin.svg.js"
import {collaboration} from "../../context/context.js"
import {removeLoadingPageIndicator} from "../../main.js"
import exportSvg from "../../icons/gravity-ui/export.svg.js"
import warningSvg from "../../icons/gravity-ui/warning.svg.js"
import {generate_id} from "@benev/slate/x/tools/generate_id.js"
import circlePlaySvg from "../../icons/gravity-ui/circle-play.svg.js"
import collaborateSvg from "../../icons/gravity-ui/collaborate.svg.js"
import {Project} from "../../context/controllers/project/controller.js"
import documentImportSvg from "../../icons/carbon-icons/document-import.svg.js"
import {calculateProjectDuration} from "../../utils/calculate-project-duration.js"
import {convert_ms_to_hms} from "../omni-timeline/views/time-ruler/utils/convert_ms_to_hms.js"

export class OmniManager extends LitElement {
	project = new Project()
	static styles = styles

	@property({type: Boolean})
	joiningInProgress = false

	@property()
	sessionError: unknown = ""
	
	@property({type: String, attribute: false})
	private inviteID = ""

	@property()
	projects: HistoricalState[] = []

	loadProjects() {
		for(const project of this.project.loadProjectsFromStorage()) {
			if(project)
				this.projects = [...this.projects, project]
		}
	}

	removeProject(projectId: string, prefix: string) {
		localStorage.removeItem(prefix + projectId)
		this.projects = []
		this.loadProjects()
		this.project.onNotify.publish({message: "Project removed successfully!", type: "info"})
		this.requestUpdate()
	}

	connectedCallback() {
		super.connectedCallback()
		this.loadProjects()
		removeLoadingPageIndicator()
		this.project.onNotify(e => this.showToast(e.message, e.type))
	}

	showToast(message: string, type: "error" | "warning" | "info") {
		const toast = document.createElement("div")
		toast.textContent = message
		toast.className = `toast ${type}`
		document.body.appendChild(toast)
		setTimeout(() => document.body.removeChild(toast), 5000)
	}

	async joinRoom() {
		this.joiningInProgress = true
		this.requestUpdate()
		try {
			await collaboration.joinRoom(this.inviteID)
			this.joiningInProgress = false
		} catch(e) {
			collaboration.initiatingProject = false
			this.sessionError = e
			this.joiningInProgress = false
		}
		this.requestUpdate()
	}

	handleCollaborationUI(content: TemplateResult) {
		return html`
			<div class="collaboration">
				<h3 class=title>${collaborateSvg} Collaboration</h3>
				${this.joiningInProgress
					? html`<span class=creating>Session loading ${loadingSvg}</span>`
					: this.sessionError === ""
						? content
						: html`
								<span class=error>${warningSvg} error joining session</span>
								<span class=reason>reason: <span>${this.sessionError}</span></span>
								<button @click=${() => {this.sessionError = ""; this.requestUpdate()}} class="renew">renew</button>
							`
				}
			</div>
		`
	}

	setInviteId(str: string) {
		this.inviteID = str
		this.requestUpdate()
	}

	render() {
		return html`
			<div class="box">
				<div class="projects">
					<div class=flex>
						<a href="#/editor/${generate_id()}" class="new-project">
							${addSvg}
							<span>Create new project</span>
						</a>
						<a class="import-project">
							<label for="fileInput" class="input-import">${documentImportSvg}</label>
							<span>Import project</span>
							<input type="file" id="fileInput" accept=".zip" @change=${async (e: Event) => {
								const projectState = await this.project.importProject(e.target as HTMLInputElement)
								if(projectState) {
									this.projects.unshift(projectState)
									this.requestUpdate()
								}
							}}>
						</a>
					</div>
					${this.handleCollaborationUI(html`
						<div>
							<h3 class=join>Join Session</h3>
							<input
								class="code-input"
								placeholder="Enter Invite Code"
								@input=${(e: InputEvent) => {this.setInviteId((e.target as HTMLInputElement).value); this.requestUpdate()}}
							>
							<button
								?disabled=${this.inviteID === ""}
								class="join"
								@click=${this.joinRoom}
							>
								Join
							</button>
						</div>
					`)}
					<h1>Your projects</h1>
					<div class=flex>
						${this.projects.map(project => html`
							<div class="project">
								<div class=items>
									<button class="export" @click=${() => this.project.exportProject(project)}>${exportSvg}</button>
									<span class="duration">${project.effects?.length === 0 ? 0 : convert_ms_to_hms(calculateProjectDuration(project.effects))}s</span>
									<button class="remove"><span @click=${() => this.removeProject(project.projectId, "omniclip_")} class="icon">${binSvg}<span></button>
								</div>
								<a href="#/editor/${project.projectId}"class="open">${circlePlaySvg}</a>
								<span class="project-name">${project.projectName}</span>
							</div>
						`)}
					</div>
				</div>
			</div>
	`}
}
