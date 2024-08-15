import posthog from 'posthog-js'
import {register_to_dom} from "@benev/slate"
import {ConstructEditor, single_panel_layout} from "@benev/construct/x/mini.js"

import {omnislate, OmniContext} from "./context/context.js"
import {TextPanel} from "./components/omni-text/panel.js"
import {AnimPanel} from "./components/omni-anim/panel.js"
import {MediaPanel} from "./components/omni-media/panel.js"
import {OmniText} from "./components/omni-text/component.js"
import {OmniAnim} from "./components/omni-anim/component.js"
import {OmniMedia} from "./components/omni-media/component.js"
import {TimelinePanel} from "./components/omni-timeline/panel.js"
import {LandingPage} from './components/landingpage/component.js'
import {OmniTimeline} from "./components/omni-timeline/component.js"
import {ProjectSettingsPanel} from "./views/project-settings/panel.js"
import {ExportPanel} from "./components/omni-timeline/views/export/panel.js"
import {MediaPlayerPanel} from "./components/omni-timeline/views/media-player/panel.js"

posthog.init('phc_CMbHMWGVJSqM1RqGyGxWCyqgaSGbGFKl964fIN3NDwU',
	{
			api_host: 'https://eu.i.posthog.com',
			person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
			autocapture: false
	}
)

export function setupContext() {
	omnislate.context = new OmniContext({
		panels: {
			TimelinePanel,
			MediaPanel,
			MediaPlayerPanel,
			TextPanel,
			ExportPanel,
			ProjectSettingsPanel,
			AnimPanel
		},
		layouts: {
			empty: single_panel_layout("TimelinePanel"),
			default: single_panel_layout("TimelinePanel"),
		},
	})
}

setupContext()

//@ts-ignore
register_to_dom({ConstructEditor, OmniTimeline, OmniText, OmniMedia, LandingPage, OmniAnim})
