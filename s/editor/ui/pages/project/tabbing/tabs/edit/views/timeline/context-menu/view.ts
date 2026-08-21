
import {html} from "lit"
import {Id} from "@omnimedia/omnitool"
import {dom, shadow, useCss, useMount, useShadow} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../../../../../../../../../theme.css.js"
import {Idx} from "../../../../../../../../logic/parts/index.js"
import {EditorContext} from "../../../../../../../../../context/context.js"
import stackSvg from "../../../../../../../../icons/gravity-ui/stack.svg.js"
import sequenceSvg from "../../../../../../../../icons/gravity-ui/sequence.svg.js"

import "@awesome.me/webawesome/dist/components/dropdown/dropdown.js"
import "@awesome.me/webawesome/dist/components/dropdown-item/dropdown-item.js"

export const TimelineContextMenu = shadow((context: EditorContext) => {
	useCss(themeCss, styleCss)
	const root = useShadow()
	const session = context.session
	const canvas = session.canvas

	let itemId: Id

	useMount(() => dom.events(canvas.canvas, {
		contextmenu: (event: MouseEvent) => {
			event.preventDefault()
			const menu = dom.in(root).require("wa-dropdown") as HTMLElementTagNameMap["wa-dropdown"]
			const point = canvas.pointAt(event)
			const clip = canvas.clipAt(point.x, point.y)
			menu.open = false

			if (!clip || Idx.isStructKind(clip.kind))
				return

			itemId = clip.itemId
			const anchor = dom.in(root).require("button")
			anchor.style.left = `${event.clientX}px`
			anchor.style.top = `${event.clientY}px`
			menu.open = true
		},
	}))

	const addContainer = ({detail}: CustomEvent) => session.wrapItem(itemId, detail.item.value)

	return html`
		<wa-dropdown placement="bottom-start" size="small" @wa-select=${addContainer}>
			<button slot="trigger" aria-label="Add timeline structure"></button>
			<wa-dropdown-item value="stack">
				<span slot="icon">${stackSvg}</span>
				Add stack
			</wa-dropdown-item>
			<wa-dropdown-item value="sequence">
				<span slot="icon">${sequenceSvg}</span>
				Add sequence
			</wa-dropdown-item>
		</wa-dropdown>
	`
})

