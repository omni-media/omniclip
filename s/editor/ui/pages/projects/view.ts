
import {html} from 'lit'
import {shadow, spinner, useCss, useName, useSignal, useWait} from '@e280/sly'

import styleCss from './style.css.js'
import type {AppRouter} from '../router.js'
import themeCss from '../../../theme.css.js'
import {ProjectGrid} from './renderers/grid.js'
import addSvg from '../../icons/gravity-ui/add.svg.js'
import {Strata} from '../../../context/parts/strata.js'
import {ProjectLocalStatus} from './renderers/status.js'
import {ProjectDetailsDrawer} from './renderers/drawer.js'
import exportSvg from '../../icons/gravity-ui/export.svg.js'
import slidersSvg from '../../icons/gravity-ui/sliders.svg.js'
import {loadProjectPreviews, sortLabels, SortMode, ViewMode} from './constants.js'

export const ProjectsPage = (router: AppRouter) => shadow(() => {
	useName('projects')
	useCss(themeCss, styleCss)

	const search = useSignal('')
	const sort = useSignal<SortMode>('recent')
	const viewMode = useSignal<ViewMode>('grid')
	const drawerProjectId = useSignal<string | null>(null)
	const projects = useWait(loadProjectPreviews)

	const openProject = (id: string) => router.go.project(id)
	const createProject = async() => {
		const projectId = `project-${Date.now().toString(36)}`
		await Strata.createProject(projectId)
		router.go.project(projectId)
	}
	const openDetails = (event: Event, id: string) => {
		event.stopPropagation()
		drawerProjectId.value = id
	}

	return spinner(projects(), projects => {
		const filteredProjects = projects
			.filter(project => project.title.toLowerCase().includes(search.value.trim().toLowerCase()))
			.sort((a, b) => {
				switch (sort.value) {
					case 'name':
						return a.title.localeCompare(b.title)
					case 'duration':
						return b.durationSeconds - a.durationSeconds
					default:
						return b.editedRank - a.editedRank
				}
			})

		const drawerProject = projects.find(project => project.id === drawerProjectId.value)

		return html`
			<div class="project-hub">
				<header class="topbar">
					<a class="brand" href=${router.href.home()}>
						<div class="logo-mark"></div>
						<span class="brand-copy">
							<strong>omniclip</strong>
							<span>LOCAL-FIRST VIDEO EDITOR</span>
						</span>
					</a>

					<label class="search">
						<span></span>
						<input
							.value=${search.value}
							@input=${(event: InputEvent) => search.value = (event.target as HTMLInputElement).value}
							placeholder="Search projects..."
						/>
					</label>

					<div class="controls">
						<label class="sort">
							<span>Sort by</span>
							<select
								.value=${sort.value}
								@change=${(event: Event) => sort.value = (event.target as HTMLSelectElement).value as SortMode}
							>
								${Object.entries(sortLabels).map(([value, label]) => html`
									<option value=${value}>${label}</option>
								`)}
							</select>
						</label>

						<div class="view-toggle">
							<button
								title="Grid view"
								?data-active=${viewMode.value === 'grid'}
								@click=${() => viewMode.value = 'grid'}
							>▦</button>
							<button
								title="List view"
								?data-active=${viewMode.value === 'list'}
								@click=${() => viewMode.value = 'list'}
							>☷</button>
						</div>

						<button class="icon-button" title="Settings">${slidersSvg}</button>
					</div>
				</header>

				<main class="hub-content">
					<header class="section-header">
						<h1>Your Projects</h1>

						<div class="project-commands">
							<button class="command-button" type="button">
								${exportSvg}
								<span>Import Project</span>
							</button>

							<button class="command-button primary" type="button" @click=${createProject}>
								${addSvg}
								<span>New Project</span>
							</button>
						</div>
					</header>

					${filteredProjects.length
						? ProjectGrid(filteredProjects, openProject, openDetails)
						: html`
							<section class="empty-state">
								<h1>No projects yet</h1>
								<p>Create a new project or import an existing timeline to get started.</p>
							</section>
						`}

					${ProjectLocalStatus()}
				</main>

				${drawerProject
					? ProjectDetailsDrawer(
							drawerProject,
							openProject,
							() => drawerProjectId.value = null
						)
					: null
				}
			</div>
	`})
})

