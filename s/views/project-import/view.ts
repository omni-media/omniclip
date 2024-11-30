import {Op, html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../context/context.js"
import {StateHandler} from "../state-handler/view.js"
import importSvg from "../../icons/carbon-icons/document-import.svg.js"

export const ProjectImport = shadow_view(use => () => {
	use.styles(styles)
	use.watch(() => use.context.state)

	const actions = use.context.actions
	const state = use.context.state
	const importController = use.context.controllers.import

	
	return StateHandler(Op.all(
		use.context.is_webcodecs_supported.value,
		use.context.helpers.ffmpeg.is_loading.value), () => html`
			<div class=importProject> 
				<h2>Load Project File</h2>
                                <label class="import-btn" for="import">${importSvg} Import Project</label>
                                <input type="file" accept=".zip" id="import" class="hide" @change=${(e: Event) => importController.importZip(e.target as HTMLInputElement)}>
				<div @click=${()=> alert('click aqui')}>Import</div>
			</div>
		`)
})
