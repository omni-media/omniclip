
import {css, html} from 'lit'
import {shadow, useCss} from '@e280/sly'
import modalCss from '../../../../context/parts/modal/modal.css.js'

import {ModalDefinition} from '../../../../context/parts/modal/types.js'

type ConfirmModalOptions = {
	title: string
	content: unknown
	yes?: string
	no?: string
	confirmVariant?: 'brand' | 'neutral' | 'success' | 'warning' | 'danger'
}

export const confirmModal = ({
	title,
	content,
	yes = 'Yes',
	no = 'No',
	confirmVariant = 'brand',
}: ConfirmModalOptions): ModalDefinition<true> => ({
	label: title,
	render: (_, controls) => shadow(() => {
		useCss(modalCss, css`
			:host {
				display: block;
				width: min(24rem, calc(100vw - 4rem));
			}

			.modal-body {
				font-size: var(--font-size-sm);
				line-height: 1.5;
				overflow-wrap: anywhere;

				> p {
					margin: 0;
				}
			}
		`)

		return html`
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
		`
	})()
})

