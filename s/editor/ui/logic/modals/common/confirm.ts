
import {html} from "lit"
import {Content} from "@e280/sly"

import {baseModal} from "./base.js"
import {EditorContext} from "../../../../context/context.js"
import {ModalDefinition} from "../../../../context/parts/modal/types.js"

type ConfirmModalOptions = {
	title: string
	content: Content | ((context: EditorContext) =>  Content)
	yes?: string
	no?: string
	confirmVariant?: "brand" | "neutral" | "success" | "warning" | "danger"
}

export const confirmModal = ({
	title,
	content,
	yes = "Yes",
	no = "No",
	confirmVariant = "brand",
}: ConfirmModalOptions): ModalDefinition<true> => baseModal<true>({
	title,
	body: (context) => html`${typeof content === "function" ? content(context) : content}`,
	footer: (_context, controls) => html`
		<wa-button variant="neutral" @click=${controls.cancel}>
			${no}
		</wa-button>

		<wa-button variant=${confirmVariant} @click=${() => controls.resolve(true)}>
			${yes}
		</wa-button>
	`,
})
