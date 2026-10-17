
import {html} from 'lit'
import {light} from '@e280/sly'

import {ModalDefinition} from '../../../../context/parts/modal/types.js'

type ConfirmModalOptions = {
	title: string
	content: unknown
	yes?: string
	no?: string
	confirmVariant?: 'brand' | 'neutral' | 'success' | 'warning' | 'danger'
}

export const confirmModal = ({
	content,
	yes = 'Yes',
	no = 'No',
	confirmVariant = 'brand',
}: ConfirmModalOptions): ModalDefinition<true> => ({
	label: 'confirm',
	render: (_, controls) => light(() => html`
			<div class="modal">
				<div class="modal-body">
					${content}
				</div>

				<div class="modal-footer">
					<wa-button variant="neutral" @click=${controls.cancel}>
						${no}
					</wa-button>

					<wa-button
						variant=${confirmVariant}
						@click=${() => controls.resolve(true)}
					>
						${yes}
					</wa-button>
				</div>
			</div>
		`)()
})
