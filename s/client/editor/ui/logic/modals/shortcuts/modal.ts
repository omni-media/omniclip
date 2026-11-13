
import {html} from "lit"
import {CustomizeView} from "@benev/tact"
import {shadow, useCss, useMount} from "@e280/sly"

import styleCss from "./style.css.js"
import modalCss from "../../../../context/parts/modal/modal.css.js"
import type {ModalDefinition} from "../../../../context/parts/modal/types.js"

export const shortcutsModal = (): ModalDefinition<void> => ({
	label: "Keyboard Shortcuts",
	render: (context, modal) => shadow(() => {
		useCss(modalCss, styleCss)
		useMount(() => context.keybindings.suspend())

		return html`
			${CustomizeView(context.keybindings.tact.deck)}
			<div class="modal-footer">
				<wa-button appearance="plain" @click=${modal.cancel}>Done</wa-button>
			</div>
		`
	})(),
})

