
import {html} from "lit"
import {createElement} from "react"
import type {Signal} from "@e280/strata"
import {createRoot} from "react-dom/client"
import {createRef, ref} from "lit/directives/ref.js"
import {shadow, useCss, useMount, useOnce, useRendered} from "@e280/sly"

import styleCss from "./style.css.js"
import {AssistantChat} from "./chat.js"

export const Assistant = shadow((open: Signal<boolean>) => {
	useCss(styleCss)

	const container = useOnce(() => createRef<HTMLDivElement>())
	const rendered = useRendered()

	useMount(() => {
		let root: ReturnType<typeof createRoot> | undefined
		let disposed = false

		rendered.then(() => {
			if (disposed)
				return

			root = createRoot(container.value!)
			root.render(createElement(AssistantChat, {
				onClose: () => open.value = false,
			}))
		})

		return () => {
			disposed = true
			root?.unmount()
		}
	})

	return html`
		<div
			?hidden=${!open.value}
			${ref(container)}>
		</div>
	`
})

