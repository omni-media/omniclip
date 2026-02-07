import posthog from 'posthog-js'
import {register_to_dom, html, Nexus} from "@benev/slate"
import {ConstructEditor, freshId} from "@benev/construct/x/mini.js"

import {Tooltip} from './views/tooltip/view.js'
import {HashRouter} from './tools/hash-router.js'
import {TestEnvAlert} from './views/test-env-alert.js'
import checkSvg from './icons/gravity-ui/check.svg.js'
import exportSvg from './icons/gravity-ui/export.svg.js'
import {ShortcutsManager} from './views/shortcuts/view.js'
import {OmniText} from "./components/omni-text/component.js"
import {OmniAnim} from "./components/omni-anim/component.js"
import {OmniMedia} from "./components/omni-media/component.js"
import {LandingPage} from './components/landingpage/component.js'
import {OmniManager} from './components/omni-manager/component.js'
import {OmniFilters} from './components/omni-filters/component.js'
import {CollaborationManager} from './views/collaboration/view.js'
import {OmniTimeline} from "./components/omni-timeline/component.js"
import pencilSquareSvg from './icons/gravity-ui/pencil-square.svg.js'
import {omnislate, OmniContext, collaboration} from "./context/context.js"
import {OmniTransitions} from "./components/omni-transitions/component.js"
import {MediaPlayer} from './components/omni-timeline/views/media-player/view.js'
import {ProjectSettings} from './views/project-settings/view.js'
import {ExportConfirmModal, ExportInProgressOverlay} from './components/omni-timeline/views/export/view.js'

posthog.init('phc_CMbHMWGVJSqM1RqGyGxWCyqgaSGbGFKl964fIN3NDwU',
	{
			api_host: 'https://eu.i.posthog.com',
			person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
			autocapture: false
	}
)

const IS_TEST_ENV = window.location.hostname.startsWith("test")

function emptyLayout() {
	return () => ({
		id: freshId(),
		kind: "cell" as const,
		size: null,
		vertical: true,
		children: [],
	})
}

export function setupContext(projectId: string) {
	omnislate.context = new OmniContext({
		projectId,
		panels: {},
		layouts: {
			empty: emptyLayout(),
			default: emptyLayout(),
		},
	})
	return omnislate
}

register_to_dom({OmniManager, LandingPage})
let registered = false

export function removeLoadingPageIndicator() {
	const loadingPageIndicatorElement = document.querySelector(".loading-page-indicator")
	if(loadingPageIndicatorElement)
		document.body.removeChild(loadingPageIndicatorElement!)
}

type LeftTab = "media" | "text"
type RightTab = "filters" | "animations" | "transitions"

const VideoEditor =  (omnislate: Nexus<OmniContext>) => omnislate.light_view((use) => () => {
	use.watch(() => use.context.state)
	const collaboration = use.context.controllers.collaboration
	const [renameDisabled, setRenameDisabled] = use.state(true)
	const toggleProjectRename = (e: PointerEvent) => {
		e.preventDefault()
		setRenameDisabled(!renameDisabled)
	}

	const confirmProjectRename = () => {
		const projectName = use.element.querySelector(".input-name") as HTMLInputElement
		use.context.actions.set_project_name(projectName.value)
	}

	use.mount(() => {
		const dispose = collaboration.onChange(() => use.rerender())
		return () => dispose()
	})

	const [showConfirmExportModal, setShowConfirmExportModal] = use.state(false)
	const isClient = collaboration.client

	const [leftTab, setLeftTab] = use.state<LeftTab>("media")
	const [rightTab, setRightTab] = use.state<RightTab>("filters")

	const selected = use.context.state.selected_effect

	const renderRightPanel = () => {
		if (!selected) {
			return html`
				<div class="panel-tabs">
					<button data-active>Settings</button>
				</div>
				<div class="panel-content">
					${ProjectSettings([])}
				</div>
			`
		}
		if (selected.kind === "text") {
			return html`
				<div class="panel-tabs">
					<button data-active>Text</button>
				</div>
				<div class="panel-content">
					<omni-text></omni-text>
				</div>
			`
		}
		return html`
			<div class="panel-tabs">
				<button
					?data-active=${rightTab === "filters"}
					@click=${() => setRightTab("filters")}
				>Filters</button>
				<button
					?data-active=${rightTab === "animations"}
					@click=${() => setRightTab("animations")}
				>Animations</button>
				<button
					?data-active=${rightTab === "transitions"}
					@click=${() => setRightTab("transitions")}
				>Transitions</button>
			</div>
			<div class="panel-content">
				${rightTab === "filters" ? html`<omni-filters></omni-filters>` : null}
				${rightTab === "animations" ? html`<omni-anim></omni-anim>` : null}
				${rightTab === "transitions" ? html`<omni-transitions></omni-transitions>` : null}
			</div>
		`
	}

	return html`
		<div class=editor>
			${IS_TEST_ENV ? TestEnvAlert : null}
			${ExportConfirmModal([showConfirmExportModal, setShowConfirmExportModal])}
			${ExportInProgressOverlay([])}
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
					${Tooltip(
						html`
						<button
							?disabled=${use.context.state.settings.bitrate <= 0 || isClient}
							class="export-button"
							@click=${() => setShowConfirmExportModal(true)}
						>
							<span class="text">${exportSvg}<span>Export</span></span>
						</button>`,
						html`${isClient ?  "Only host can export" : null}`,
						"",
						"bottom-end"
					)}
				</div>
			</div>
			<div class="editor-layout">
				<div class="panel-left">
					<div class="panel-tabs">
						<button
							?data-active=${leftTab === "media"}
							@click=${() => setLeftTab("media")}
						>Media</button>
						<button
							?data-active=${leftTab === "text"}
							@click=${() => setLeftTab("text")}
						>Text</button>
					</div>
					<div class="panel-content">
						${leftTab === "media" ? html`<omni-media></omni-media>` : null}
						${leftTab === "text" ? html`<omni-text></omni-text>` : null}
					</div>
				</div>
				<div class="panel-center">
					${MediaPlayer([])}
				</div>
				<div class="panel-right">
					${renderRightPanel()}
				</div>
				<div class="panel-bottom">
					<omni-timeline></omni-timeline>
				</div>
			</div>
		</div>
	`
})

const router = new HashRouter({
	'/': () => {
		return html`<landing-page></landing-page>`
	},
	'/editor': () => {
		collaboration.disconnect()
		return html`<omni-manager></omni-manager>`
	},
	'/editor/*': (projectId) => {
		if(!collaboration.initiatingProject) {
			collaboration.disconnect()
		}
		if(!registered) {
			register_to_dom({OmniTimeline, OmniText, OmniMedia, ConstructEditor, OmniFilters, OmniTransitions, OmniAnim})
			registered = true
		}
		const omnislate = setupContext(projectId)
		return html`${VideoEditor(omnislate)()}`
	},
})

document.body.append(router.element)
document.documentElement.className = "sl-theme-dark"
