
import {html} from 'lit'
import {shadow, spinner, useCss, useName, useSignal, useWait} from '@e280/sly'

import styleCss from './style.css.js'
import type {AppRouter} from '../router.js'
import themeCss from '../../../theme.css.js'
import {ProjectGrid} from './renderers/grid.js'
import {FeaturedProject} from './renderers/featured.js'
import addSvg from '../../icons/gravity-ui/add.svg.js'
import {Strata} from '../../../context/parts/strata.js'
import {ProjectDetailsDrawer} from './renderers/drawer.js'
import exportSvg from '../../icons/gravity-ui/export.svg.js'
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
		const featuredProject = [...projects].sort((a, b) => b.editedRank - a.editedRank)[0]
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
						<img class="logo-mark" src="/assets/logo/omni.png" alt="" />
						<span class="brand-copy">
							<strong>omniclip</strong>
							<span>VIDEO STUDIO</span>
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
						<button class="topbar-button" type="button">${exportSvg}<span>Import</span></button>
						<button class="topbar-button primary" type="button" @click=${createProject}>
							${addSvg}<span>New project</span>
						</button>
					</div>
				</header>

				<main class="hub-content">
					${featuredProject ? FeaturedProject(featuredProject, openProject, openDetails) : null}

					<section class="project-library">
						<header class="section-header">
							<div class="section-heading">
								<span class="eyebrow">Project library</span>
								<h2>Your projects <small>${filteredProjects.length}</small></h2>
							</div>

							<div class="library-controls">
								<label class="sort">
									<span>Sort</span>
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
									<button title="Grid view" ?data-active=${viewMode.value === 'grid'} @click=${() => viewMode.value = 'grid'}>▦</button>
									<button title="List view" ?data-active=${viewMode.value === 'list'} @click=${() => viewMode.value = 'list'}>☷</button>
								</div>
							</div>
						</header>

						${filteredProjects.length
							? ProjectGrid(filteredProjects, openProject, openDetails, viewMode.value)
							: html`
								<section class="empty-state">
									<h2>No projects found</h2>
									<p>Create a new project or try a different search.</p>
								</section>
							`}
					</section>

					<section class="creator-banner">
						<div>
							<span class="eyebrow">New edit</span>
							<h2>Turn your next idea into a finished cut.</h2>
							<p>Start with an empty timeline and build with Omniclip’s flexible media primitives.</p>
						</div>
						<button class="banner-button" @click=${createProject}>${addSvg}<span>Create project</span></button>
					</section>

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

