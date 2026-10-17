
import {html} from 'lit'
import {light} from '@e280/sly'
import {createRef, ref} from 'lit/directives/ref.js'

import {ModalDefinition} from '../../../../context/parts/modal/types.js'

import '@awesome.me/webawesome/dist/components/input/input.js'

type PromptModalOptions = {
	label?: string
	value?: string
	placeholder?: string
	yes?: string
	no?: string
}

export const promptModal = ({
	label = '',
	value = '',
	placeholder = '',
	yes = 'Apply',
	no = 'Cancel',
}: PromptModalOptions): ModalDefinition<string> => {
	const input = createRef<any>()

	return {
		label: 'prompt',
		render: (_, controls) => light(() => {
			const submit = () => controls.resolve(input.value?.value ?? '')

			return () => html`
				<div class="modal">
					<div class="modal-body">
						${label && html`<label>${label}</label>`}

						<wa-input
							${ref(input)}
							.value=${value}
							placeholder=${placeholder}
							@keydown=${(event: KeyboardEvent) => {
								if (event.key === 'Enter') submit()
							}}
						></wa-input>
					</div>

					<div class="modal-footer">
						<wa-button variant="neutral" @click=${controls.cancel}>
							${no}
						</wa-button>

						<wa-button variant="brand" @click=${submit}>
							${yes}
						</wa-button>
					</div>
				</div>
			`
		})()
	}
}
