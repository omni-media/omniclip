
import {css, html} from "lit"
import {type MediaLibrary} from "@e280/quay"
import {shadow, useCss, useRendered, useShadow, useSignal} from "@e280/sly"

import {type MediaItem} from "./media-item-preview/view.js"

export const FolderLabel = shadow((library: MediaLibrary, item: MediaItem) => {
	useCss(css`
		:host {
			display: block;
			min-width: 0;
		}

		span {
			display: block;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		input {
			box-sizing: border-box;
			width: 100%;
			min-width: 0;
			color: inherit;
			background: #202020;
			border: 1px solid #555;
			border-radius: 4px;
			font: inherit;
			text-align: center;
		}
	`)

	const editing = useSignal(false)
	const rendered = useRendered()
	const root = useShadow()

	const startRename = () => {
		if (!library.permissions(item).rename) return
		editing(true)
		void rendered.then(() => {
			const input = root.querySelector("input")
			input?.focus()
			input?.select()
		})
	}

	const onKeyDown = (event: KeyboardEvent) => {
		const input = event.target as HTMLInputElement
		if (event.key === "Escape") {
			input.value = item.specimen.label
			editing(false)
		}
		if (event.key === "Enter")
			input.blur()
	}

	const onBlur = (event: FocusEvent) => {
		const name = (event.target as HTMLInputElement).value.trim()
		editing(false)
		if (name && name !== item.specimen.label)
			void library.rename(item, name)
				.catch(error => alert(error instanceof Error ? error.message : String(error)))
			// TODO: should be toast not alert
	}

	return editing() ? html`
		<input aria-label="Folder name" .value=${item.specimen.label}
			@keydown=${onKeyDown} @blur=${onBlur}>
	` : html`
		<span @dblclick=${startRename}>${item.specimen.label}</span>
	`
})

