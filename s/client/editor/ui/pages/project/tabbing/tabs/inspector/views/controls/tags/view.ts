
import {html} from "lit"
import {need} from "@e280/stz"
import type {Id} from "@omnimedia/omnitool"
import {repeat} from "lit/directives/repeat.js"
import {shadow, useCss, useRef, useSignal} from "@e280/sly"

import styleCss from "./style.css.js"
import {TagList} from "./views/list.js"
import {controlsStyles} from "../styles.css.js"
import {EditorContext} from "../../../../../../../../../context/context.js"
import {assignTags} from "../../../../../../../../../context/parts/tags/ops.js"
import {ruleConflictMessage} from "../../../../../../../../logic/utils/rule-conflict.js"

import "@awesome.me/webawesome/dist/components/tag/tag.js"
import "@awesome.me/webawesome/dist/components/select/select.js"
import "@awesome.me/webawesome/dist/components/option/option.js"

export const TagControls = shadow((context: EditorContext, itemId: Id) => {
	useCss(controlsStyles, styleCss)

	const error = useSignal("")
	const selectedId = useRef(itemId)

	if (selectedId.current !== itemId) {
		selectedId.current = itemId
		error("")
	}

	const tags = context.session.organization.tags()
	const assignedIds = tags.ids(itemId)
	const colorTag = tags.colorTag(itemId)
	const assignedTags = assignedIds.map(id => need(tags.definitions, id))
	const availableTags = [...tags.definitions.values()].filter(tag => !assignedIds.includes(tag.id))

	const save = (ids: string[]) => {
		error("")
		return context.session.organization.update(
			state => assignTags(state, itemId, ids),
			rules => error(ruleConflictMessage(rules)),
		)
	}

	const addTag = (event: Event) => {
		const control = event.currentTarget as HTMLElementTagNameMap["wa-select"]
		const id = control.value as string
		if (id)
			save([...assignedIds, id])
		control.value = ""
	}

	return html`
	<div class="controls-group fields">
		<h4 class="heading">Tags</h4>
		${TagList({itemId, tags: assignedTags, colorTagId: colorTag?.id, save})}
		<wa-select aria-label="Assign a tag" size="small"
			placeholder=${availableTags.length ? "Assign a tag" : "All tags assigned"}
			.value=${""}
			?disabled=${!availableTags.length}
			@change=${addTag}>
			${repeat(availableTags, tag => `${tag.id}:${tag.label}`, tag => html`
				<wa-option value=${tag.id}>${tag.label}</wa-option>
			`)}
		</wa-select>
		${error() ? html`<span class="error" role="alert">${error()}</span>` : ""}
	</div>
	`
})

