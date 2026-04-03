
import {Content} from "@e280/sly"

import {EditorContext} from "../../context.js"

export type ModalControls<Result> = {
	resolve: (value: Result) => void
	reject: (error?: unknown) => void
	cancel: () => void
}

export type ModalRenderer<Result> = (
	context: EditorContext,
	controls: ModalControls<Result>
) => Content

export type ModalDefinition<Result> = {
	title: string
	render: ModalRenderer<Result>
}

export type ActiveModal = {
	title: string
	body: Content
	close: () => void
}
