
import {html} from "lit"
import {signal} from "@e280/strata"
import {defer, once} from "@e280/stz"
import {EditorContext} from "../../context.js"
import {ActiveModal, ModalControls, ModalDefinition} from "./types.js"

export class ModalManager {
	#active = signal<ActiveModal | null>(null)

	constructor(private context: EditorContext) {}

	get active() {
		return this.#active.value
	}

	openModal<Result>(modal: ModalDefinition<Result>) {
		if (this.active)
			return Promise.reject(new Error("Modal already open"))

		const deferred = defer<Result | undefined>()

		const close = () => {
			this.#active.value = null
		}

		const finish = once((fn: () => void) => {
			close()
			fn()
		})

		const controls: ModalControls<Result> = {
			resolve: value => finish(() => deferred.resolve(value)),
			reject: error => finish(() => deferred.reject(error)),
			cancel: () => finish(() => deferred.resolve(undefined)),
		}

		this.#active.value = {
			label: modal.label,
			body: modal.render(this.context, controls),
			cancel: controls.cancel,
		}

		return deferred.promise
	}

	render() {
		const active = this.active
		if (!active)
			return null

		return html`
			<wa-dialog
				open
				@wa-after-hide=${(e: Event) => {
					if(e.target === e.currentTarget) {
						active.cancel()
					}
				}}
			>
				<div slot=label>${active.label}</div>
				${active.body}
			</wa-dialog>
		`
	}
}

