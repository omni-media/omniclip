
import {html} from "lit"

import {ModalDefinition, ModalRenderer} from "../../../../context/parts/modal/types.js"

type BaseModalOptions<Result> = {
	title: string
	header?: ModalRenderer<Result>
	body: ModalRenderer<Result>
	footer?: ModalRenderer<Result>
}

export const baseModal = <Result = void>({
	title,
	header,
	body,
	footer,
}: BaseModalOptions<Result>): ModalDefinition<Result> => ({
	title,
	render: (context, controls) => html`
		${header ? html`
			<div slot="label">
				${header(context, controls)}
			</div>
		` : null}

		<wa-button
			slot="header-actions"
			variant="plain"
			aria-label="Close modal"
			@click=${controls.cancel}
		>
			x
		</wa-button>

		<div class="modal-body">
			${body(context, controls)}
		</div>

		${footer ? html`
			<div slot="footer" class="modal-footer">
				${footer(context, controls)}
			</div>
		` : null}
	`,
})

