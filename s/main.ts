import posthog from 'posthog-js'
import {register_to_dom, html} from "@benev/slate"
import {ConstructEditor, single_panel_layout} from "@benev/construct/x/mini.js"

import {HashRouter} from './tools/hash-router.js'
import {omnislate, OmniContext} from "./context/context.js"
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
import {OmniTimeline} from "./components/omni-timeline/component.js"
import {ProjectSettingsPanel} from "./views/project-settings/panel.js"
import {TransitionsPanel} from "./components/omni-transitions/panel.js"
import {OmniTransitions} from "./components/omni-transitions/component.js"
import {ExportPanel} from "./components/omni-timeline/views/export/panel.js"
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
		return html`<construct-editor></construct-editor>`
	},
})

document.body.append(router.element)

//@ts-ignore
