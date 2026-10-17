
import {Content} from '@e280/sly'
import {EditorContext} from '../../context.js'

export type ModalControls<Result> = {
	resolve: (value: Result) => void
	reject: (error?: unknown) => void
	cancel: () => void
}

export type ModalDefinition<Result> = {
	label: Content
	render: (
		context: EditorContext,
		controls: ModalControls<Result>
	) => Content
}

export type ActiveModal = {
	label: Content
	body: Content
	cancel: () => void
}

