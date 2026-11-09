
import {html} from "lit"
import {repeat} from "lit/directives/repeat.js"
import {light, loot, useOnce, useRef, useSignal} from "@e280/sly"

import {renderTag} from "../renderers/tag.js"
import type {Tag} from "../../../../../../../../../../context/parts/tags/types.js"
import {moveTag} from "../../../../../../../../../../context/parts/tags/ops.js"

type Options = {
	itemId: string
	tags: Tag[]
	colorTagId?: string
	save: (ids: string[]) => boolean
}

export const TagList = light((options: Options) => {
	const current = useRef(options)
	const announcement = useSignal("")

	const reorder = (source: string, target: string) => {
		if (source === target) return
		const {tags, save} = current.current
		const assigned = tags.map(tag => tag.id)
		const after = assigned.indexOf(source) < assigned.indexOf(target)
		const ids = moveTag(assigned, source, target, after)
		if (!save(ids)) return
		announcement(`${tags.find(tag => tag.id === source)?.label} moved to position ${ids.indexOf(source) + 1}.`)
	}

	const dnd = useOnce(() => new loot.DragAndDrops<string, string>({
		acceptDrop: (_, source, target) => reorder(source, target),
	}))

	if (current.current.itemId !== options.itemId) {
		announcement("")
		dnd.$draggy(undefined)
		dnd.$droppy(undefined)
	}
	current.current = options

	const {tags, colorTagId, save} = options
	const assigned = tags.map(tag => tag.id)
	return html`
		<ul class="assigned" aria-label="Assigned tags in color priority order">
			${repeat(tags, tag => tag.id, (tag, index) => renderTag(tag, {
				assigned, index,
				setsColor: colorTagId === tag.id,
				dnd,
				remove: () => save(assigned.filter(id => id !== tag.id)),
			}))}
		</ul>
		<span class="sr-only" role="status" aria-live="polite">${announcement()}</span>
	`
})

