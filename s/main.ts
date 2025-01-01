import posthog from 'posthog-js'
import {register_to_dom, html} from "@benev/slate"
import {ConstructEditor, single_panel_layout} from "@benev/construct/x/mini.js"

import {HashRouter} from './tools/hash-router.js'
import checkSvg from './icons/gravity-ui/check.svg.js'
import exportSvg from './icons/gravity-ui/export.svg.js'
import {ShortcutsManager} from './views/shortcuts/view.js'
import {TextPanel} from "./components/omni-text/panel.js"
import {AnimPanel} from "./components/omni-anim/panel.js"
import {MediaPanel} from "./components/omni-media/panel.js"
import {OmniText} from "./components/omni-text/component.js"
import {OmniAnim} from "./components/omni-anim/component.js"
import {OmniMedia} from "./components/omni-media/component.js"
import {FiltersPanel} from './components/omni-filters/panel.js'
import {TimelinePanel} from "./components/omni-timeline/panel.js"
import {LandingPage} from './components/landingpage/component.js'
import {OmniFilters} from './components/omni-filters/component.js'
import {OmniManager} from './components/omni-manager/component.js'
import {CollaborationManager} from './views/collaboration/view.js'
import {OmniTimeline} from "./components/omni-timeline/component.js"
import pencilSquareSvg from './icons/gravity-ui/pencil-square.svg.js'
import {ProjectSettingsPanel} from "./views/project-settings/panel.js"
import {TransitionsPanel} from "./components/omni-transitions/panel.js"
import {omnislate, OmniContext, light_view} from "./context/context.js"
import {OmniTransitions} from "./components/omni-transitions/component.js"
import {ExportPanel} from "./components/omni-timeline/views/export/panel.js"
import {ExportInProgressModal} from './components/omni-timeline/views/export/view.js'
import {MediaPlayerPanel} from "./components/omni-timeline/views/media-player/panel.js"

posthog.init('phc_CMbHMWGVJSqM1RqGyGxWCyqgaSGbGFKl964fIN3NDwU',
	{
			api_host: 'https://eu.i.posthog.com',
			person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
			autocapture: false
	}
)

export function setupContext(projectId: string) {
	omnislate.context = new OmniContext({
		projectId,
		panels: {
			TimelinePanel,
			MediaPanel,
			MediaPlayerPanel,
			TextPanel,
			ExportPanel,
			ProjectSettingsPanel,
			AnimPanel,
			FiltersPanel,
			TransitionsPanel
		},
		layouts: {
			empty: single_panel_layout("TimelinePanel"),
			default: single_panel_layout("TimelinePanel"),
		},
	})
}

register_to_dom({OmniManager, LandingPage})
let registered = false

export function removeLoadingPageIndicator() {
	const loadingPageIndicatorElement = document.querySelector(".loading-page-indicator")
	if(loadingPageIndicatorElement)
		document.body.removeChild(loadingPageIndicatorElement!)
}

const VideoEditor = light_view((use) => () => {
	const [renameDisabled, setRenameDisabled] = use.state(true)
	const toggleProjectRename = (e: PointerEvent) => {
		e.preventDefault()
		setRenameDisabled(!renameDisabled)
	}

	const confirmProjectRename = () => {
		const projectName = use.element.querySelector(".input-name") as HTMLInputElement
		use.context.actions.set_project_name(projectName.value)
	}

	return html`
		<div class=editor>
			${ExportInProgressModal([])}
			<div class=editor-header>
				<div class=flex>
					<img class="logo" src="/assets/icon3.png" />
					<div class="project-name">
						<span class="box">
							<input class="input-name" ?disabled=${renameDisabled} .value=${use.context.state.projectName}>
							<span class="icons" @click=${toggleProjectRename}>
								${renameDisabled ? html`${pencilSquareSvg}` : html`<span @click=${confirmProjectRename} class="check">${checkSvg}</span>`}
							</span>
						</span>
					</div>
				</div>
				<div class="export">
					${CollaborationManager([])}
					${ShortcutsManager([])}
					<button
						?disabled=${omnislate.context.state.settings.bitrate <= 0}
						class="export-button"
						@click=${() => omnislate.context.controllers.video_export.export_start(omnislate.context.state, omnislate.context.state.settings.bitrate)}
					>
						<span class="text">${exportSvg}<span>Export</span></span>
					</button>
				</div>
			</div>
			<construct-editor></construct-editor>
		</div>
	`
})

const router = new HashRouter({
	'/': () => {
		return html`<landing-page></landing-page>`
	},
	'/editor': () => {
		return html`<omni-manager></omni-manager>`
	},
	'/editor/*': (projectId) => {
		if(!registered) {
			register_to_dom({OmniTimeline, OmniText, OmniMedia, OmniAnim, ConstructEditor, OmniFilters, OmniTransitions})
			registered = true
		}
		setupContext(projectId)
		return html`${VideoEditor()}`
	},
})

document.body.append(router.element)

//@ts-ignore
