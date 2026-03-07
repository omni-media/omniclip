import {html} from "lit"
import {view} from "@e280/sly"

import styleCss from "./style.css.js"
import {TabBar} from "./tabbing/bar/view.js"
import themeCss from "../../../theme.css.js"
import {EditTab} from "./tabbing/tabs/edit/view.js"
import {ExportTab} from "./tabbing/tabs/export/view.js"
import {EditorContext} from "../../../context/context.js"
import {InspectorTab} from "./tabbing/tabs/inspector/view.js"
import {OutlinerTab} from "./tabbing/tabs/outliner/view.js"
import {TimelineViewport} from "./tabbing/tabs/edit/views/viewport/view.js"

export const ProjectPage = (context: EditorContext) => view(use => (projectId: string) => {
	use.styles(themeCss, styleCss)
	use.mount(() => () => context.dispose())
	const manager = context.tabs

	const isEditTabActive = manager.activeTabId.value === "edit"
	const isOutlinerTabActive = manager.activeTabId.value === "outliner"
	const isInspectorTabActive = manager.activeTabId.value === "inspector"
	const isExportTabActive = manager.activeTabId.value === "export"

	return html`
		<div class="project-page">
			<header theme=topper>
				<div class=tab-bar>
					${TabBar(manager)}
				</div>
			</header>

			<p>editing project: ${projectId}</p>

			<div class="layout-grid">
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
		</div>
	`
})
