
import {html} from "lit"
import {shadow, spinner, useCss, useMount, useWait} from "@e280/sly"

import styleCss from "./style.css.js"
import type {AppRouter} from "../router.js"
import {TabBar} from "./tabbing/bar/view.js"
import themeCss from "../../../theme.css.js"
import {EditTab} from "./tabbing/tabs/edit/view.js"
import {MixerTab} from "./tabbing/tabs/mixer/view.js"
import {ExportTab} from "./tabbing/tabs/export/view.js"
import {ProjectNotFoundPage} from "./not-found/view.js"
import {Strata} from "../../../context/parts/strata.js"
import {EditorContext} from "../../../context/context.js"
import {OutlinerTab} from "./tabbing/tabs/outliner/view.js"
import {InspectorTab} from "./tabbing/tabs/inspector/view.js"
import {BrowserTabPanel} from "./tabbing/tabs/browser/view.js"
import {exportModal} from "../../logic/modals/export/modal.js"
import modalCss from "../../../context/parts/modal/modal.css.js"
import {settingsModal} from "../../logic/modals/settings/modal.js"
import {shortcutsModal} from "../../logic/modals/shortcuts/modal.js"
import {TimelineViewport} from "./tabbing/tabs/edit/views/viewport/view.js"
import {exportProgressModal} from "../../logic/modals/export/progress/modal.js"

import "@awesome.me/webawesome/dist/components/button/button.js"
import "@awesome.me/webawesome/dist/components/split-panel/split-panel.js"

export const ProjectPage = shadow((router: AppRouter, projectId: string) => {
	useCss(themeCss, modalCss, styleCss)

	const context = useWait(async() =>
		await Strata.hasProject(projectId)
			? EditorContext.setup(projectId)
			: null
	)

	return spinner(context(), context => {
		if (!context)
			return ProjectNotFoundPage(router, projectId)

		useMount(() => () => context.dispose())

		const manager = context.tabs

		const isEditTabActive = manager.activeTabId.value === "edit"
		const isOutlinerTabActive = manager.activeTabId.value === "outliner"
		const isInspectorTabActive = manager.activeTabId.value === "inspector"
		const isExportTabActive = manager.activeTabId.value === "export"

		const openSettings = async () => {
			const settings = await context.modals.openModal(settingsModal())
			if(settings)
				context.strata.settings.mutate(s => Object.assign(s, settings))
		}

		const openShortcuts = () => context.modals.openModal(shortcutsModal())

		const openExport = async () => {
			const settings = await context.modals.openModal(exportModal())
			if (settings)
				await context.modals.openModal(exportProgressModal(settings))
		}

		return html`
			<div class="project-page">
				<header theme=topper>
					<div class=tab-bar>
						${TabBar(manager)}
					</div>

					<div class=right>
   					<wa-button
     					@click=${openSettings}
							class=settings size="small">
      				<wa-icon slot="start" name="gear"></wa-icon>
      				Settings
    				</wa-button>

   					<wa-button
     					@click=${openShortcuts}
							class=shortcuts size="small">
      				<wa-icon slot="start" name="keyboard"></wa-icon>
      				Shortcuts
    				</wa-button>

						<div class=spacer></div>

   					<wa-button
							@click=${openExport}
							class=export
							size="small"
						>
      				<wa-icon slot="start" name="download"></wa-icon>
      				Export
    				</wa-button>
					</div>

				</header>

				<div class="layout-grid">
					<wa-split-panel class="main-split" primary="start" position-in-pixels="300">
						<wa-split-panel slot="start" orientation="vertical" class="left-split">
							<div slot="start" class="panel browser-panel">
								${BrowserTabPanel(context)}
							</div>

							<div
								slot="end"
								class="panel outliner-panel"
								?data-active=${isOutlinerTabActive}
							>
								${OutlinerTab(context)}
							</div>
						</wa-split-panel>

						<wa-split-panel slot="end" class="right-split" primary="end" position-in-pixels="300">
							<wa-split-panel slot="start" orientation="vertical" class="center-split">
								<div
									slot="start"
									class="panel viewport-panel"
									?data-active=${isEditTabActive}
								>
									${TimelineViewport(context)}
								</div>

								<div
									slot="end"
									class="panel timeline-panel"
									?data-active=${isEditTabActive}
								>
									${EditTab(context)}
								</div>
							</wa-split-panel>

							<wa-split-panel slot="end" orientation="vertical" class="inspector-split" primary="start" position-in-pixels="430">
								<div
									slot="start"
									class="panel inspector-panel"
									?data-active=${isInspectorTabActive}
								>
									${InspectorTab(context)}
								</div>

								<div
									slot="end"
									class="panel mixer-panel"
								>
									${MixerTab(context)}
								</div>
							</wa-split-panel>
						</wa-split-panel>
					</wa-split-panel>

					<div
						class="panel export-panel"
						?data-active=${isExportTabActive}
					>
						${ExportTab(context)}
					</div>
				</div>

				${context.modals.render()}
			</div>
	`})
})

