import {dashify} from "./dashify.js"

export function registerElements(elements: {
		[name: string]: {new(): HTMLElement}
	}) {

	for (const [name, element] of Object.entries(elements)) {
		const dashified = dashify(name)
		if(!customElements.get(dashified))
			customElements.define(dashified, element)
	}
}
