
import {AssistantModel} from "../model.js"

export function createLazyModel() {
	let promise: Promise<AssistantModel> | undefined

	const get = () =>
		promise ??= import("../model.js")
			.then(({AssistantModel}) => new AssistantModel())

	const dispose = () =>
		promise?.then(model => model.dispose())

	return {get, dispose}
}

export function getQuestionInput(form: HTMLFormElement) {
	return form.elements.namedItem("question") as HTMLInputElement
}

export function getChunkText(content: unknown) {
	if (typeof content === "string")
		return content

	if (!Array.isArray(content))
		return ""

	return content
		.filter(item => item?.type === "text")
		.map(item => item.text ?? "")
		.join("")
}
