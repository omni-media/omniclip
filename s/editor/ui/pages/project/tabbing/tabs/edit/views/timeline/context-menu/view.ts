
import {html} from "lit"
import {dom, shadow, useCss, useMount, useShadow} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../../../../../../../../../theme.css.js"
import {update} from "../../../../../../../../logic/parts/mutate.js"
import {Idx} from "../../../../../../../../logic/parts/index.js"
import {EditorContext} from "../../../../../../../../../context/context.js"
import binSvg from "../../../../../../../../icons/gravity-ui/bin.svg.js"
import eyeSvg from "../../../../../../../../icons/gravity-ui/eye.svg.js"
import stackSvg from "../../../../../../../../icons/gravity-ui/stack.svg.js"
import scissorsSvg from "../../../../../../../../icons/gravity-ui/scissors.svg.js"
import sequenceSvg from "../../../../../../../../icons/gravity-ui/sequence.svg.js"
import duplicateSvg from "../../../../../../../../icons/gravity-ui/duplicate.svg.js"

import "@awesome.me/webawesome/dist/components/divider/divider.js"
import "@awesome.me/webawesome/dist/components/dropdown/dropdown.js"
import "@awesome.me/webawesome/dist/components/dropdown-item/dropdown-item.js"

export const TimelineContextMenu = shadow((context: EditorContext) => {
	useCss(themeCss, styleCss)
	const root = useShadow()
	const session = context.session
	const canvas = session.canvas
	const selected = session.index.getItemMaybe(session.$selectedItem.value)
	const splittable = !!selected && Idx.isClip(selected.kind)

	useMount(() => dom.events(canvas.canvas, {
		contextmenu: (event: MouseEvent) => {
			event.preventDefault()
			const point = canvas.pointAt(event)
			const clip = canvas.clipAt(point.x, point.y)
			const menu = dom.in(root).require("wa-dropdown") as HTMLElementTagNameMap["wa-dropdown"]
			menu.open = false

			if (!clip || Idx.isStructKind(clip.kind))
				return

			session.$selectedItem.value = clip.itemId
			canvas.scheduleDraw()

			const anchor = dom.in(root).require("button")
			anchor.style.left = `${event.clientX}px`
			anchor.style.top = `${event.clientY}px`
			menu.open = true
		},
	}))

	const runAction = ({detail}: CustomEvent) => {
		if (!selected)
			return

		switch (detail.item.value) {
			case "toggle":
				session.timeline.mutate(state => update(state, selected.id, {
					enabled: selected.enabled === false,
				}))
				break
			case "split":
				if (Idx.isClip(selected.kind))
					session.splitClipAt(selected.id, session.getPlayheadInMs())
				break
			case "duplicate":
				session.duplicateClip(selected.id)
				break
			case "stack":
			case "sequence":
				session.wrapItem(selected.id, detail.item.value)
				break
			case "delete":
				session.deleteClip(selected.id)
				break
		}
	}

	return html`
		<wa-dropdown placement="bottom-start" size="small" @wa-select=${runAction}>
			<button slot="trigger" aria-label="Timeline item actions"></button>
			<small>Clip actions</small>
			<wa-dropdown-item value="toggle">
				<span slot="icon">${eyeSvg}</span>
				${selected?.enabled === false ? "Enable" : "Disable"} Item
			</wa-dropdown-item>
			<wa-dropdown-item value="split" ?disabled=${!splittable}>
				<span slot="icon">${scissorsSvg}</span>
				Split at Playhead
			</wa-dropdown-item>
			<wa-dropdown-item value="duplicate" ?disabled=${!splittable}>
				<span slot="icon">${duplicateSvg}</span>
				Duplicate Item
			</wa-dropdown-item>
			<wa-divider></wa-divider>
			<wa-dropdown-item value="stack">
				<span slot="icon">${stackSvg}</span>
				Add to Stack
			</wa-dropdown-item>
			<wa-dropdown-item value="sequence">
				<span slot="icon">${sequenceSvg}</span>
				Add to Sequence
			</wa-dropdown-item>
			<wa-divider></wa-divider>
			<wa-dropdown-item class="danger" value="delete">
				<span slot="icon">${binSvg}</span>
				Delete Item
			</wa-dropdown-item>
		</wa-dropdown>
	`
})

