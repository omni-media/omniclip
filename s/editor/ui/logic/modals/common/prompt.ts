
import {html} from "lit"
import {createRef, ref} from "lit/directives/ref.js"

import {baseModal} from "./base.js"
import {ModalDefinition} from "../../../../context/parts/modal/types.js"

import "@awesome.me/webawesome/dist/components/input/input.js"

type PromptModalOptions = {
	title: string
	label: string
	value?: string
	placeholder?: string
	yes?: string
	no?: string
}

export const promptModal = ({
	title,
	label,
	value = "",
	placeholder = "",
	yes = "Apply",
	no = "Cancel",
}: PromptModalOptions): ModalDefinition<string> => {
	const input = createRef<any>()

	return baseModal<string>({
		title,
		body: (_context, controls) => html`
			<label>${label}</label>
			<wa-input
				${ref(input)}
				value=${value}
				placeholder=${placeholder}
				@keydown=${(event: KeyboardEvent) => {
					if (event.key === "Enter")
						controls.resolve(input.value?.value ?? "")
				}}
			></wa-input>
		`,
		footer: (_context, controls) => html`
			<wa-button variant="neutral" @click=${controls.cancel}>
				${no}
			</wa-button>

			<wa-button variant="brand" @click=${() => controls.resolve(input.value?.value ?? "")}>
				${yes}
			</wa-button>
		`,
	})
}

