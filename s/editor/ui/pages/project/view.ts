
import {html} from "lit"
import {TimelineFile} from "@omnimedia/omnitool"
import {shadow, spinner, useCss, useMount, useWait} from "@e280/sly"

import styleCss from "./style.css.js"
import type {AppRouter} from "../router.js"
import {TabBar} from "./tabbing/bar/view.js"
import themeCss from "../../../theme.css.js"
import {EditTab} from "./tabbing/tabs/edit/view.js"
import {ExportTab} from "./tabbing/tabs/export/view.js"
import {EditorContext} from "../../../context/context.js"
import {OutlinerTab} from "./tabbing/tabs/outliner/view.js"
import {InspectorTab} from "./tabbing/tabs/inspector/view.js"
import {BrowserTabPanel} from "./tabbing/tabs/browser/view.js"
import {exportModal} from "../../logic/modals/export/modal.js"
import {settingsModal} from "../../logic/modals/settings/modal.js"
import {shortcutsModal} from "../../logic/modals/shortcuts/modal.js"
import {TimelineViewport} from "./tabbing/tabs/edit/views/viewport/view.js"

import "@awesome.me/webawesome/dist/components/button/button.js"

export const ProjectPage = shadow((router: AppRouter, projectId: string) => {
	useCss(themeCss, styleCss)

	const context = useWait(() => EditorContext.setup(projectId))

	return spinner(context(), context => {
		useMount(() => () => context.dispose())

		const manager = context.tabs

		const isEditTabActive = manager.activeTabId.value === "edit"
		const isOutlinerTabActive = manager.activeTabId.value === "outliner"
		const isInspectorTabActive = manager.activeTabId.value === "inspector"
		const isExportTabActive = manager.activeTabId.value === "export"

		const openSettings = async () => {
			const settings = await context.modals.openModal(settingsModal())
			if(settings)
				context.strata.settings.mutate(s => s = settings)
		}

		const openShortcuts = () => context.modals.openModal(shortcutsModal())

		const openExport = async () => {
			const settings = await context.modals.openModal(exportModal())
			if(settings) {
				const {readable} = await context.project.render(
					context.strata.timeline.state as TimelineFile,
					context.strata.settings.state.timebase
				)
				const handle = await window.showSaveFilePicker()
				const writable = await handle.createWritable()
				readable.pipeTo(writable)
			}
		}

		return html`
			<div class="project-page">
				<header theme=topper>
					<div class=tab-bar>
						${TabBar(manager)}
					</div>

					<p>editing project: ${projectId}</p>

					<div class=right>
   					<wa-button
     					@click=${openSettings}
							class=settings size="small" with-caret>
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
					<div class="panel browser-panel">
						${BrowserTabPanel(context)}
					</div>

					<div
						class="panel outliner-panel"
						?data-active=${isOutlinerTabActive}
					>
						${OutlinerTab(context)}
					</div>

					<div
						class="panel viewport-panel"
						?data-active=${isEditTabActive}
					>
						${TimelineViewport(context)}
					</div>

					<div
						class="panel inspector-panel"
						?data-active=${isInspectorTabActive}
					>
						${InspectorTab(context)}
					</div>

					<div
						class="panel timeline-panel"
						?data-active=${isEditTabActive}
					>
						${EditTab(context)}
					</div>

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

