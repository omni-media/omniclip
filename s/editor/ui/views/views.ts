
import {provide} from "@e280/stz"
import {Example} from "./example/view.js"
import {EditorContext} from "../../context/context.js"

export const editorViews = {
	Example,
}

export const prepareViews = (context: EditorContext) => ({
	...provide(context, editorViews),
} as {[K in keyof typeof editorViews]: ReturnType<(typeof editorViews)[K]>})

