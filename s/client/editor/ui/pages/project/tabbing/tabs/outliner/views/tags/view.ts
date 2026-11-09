
import {html} from "lit"
import {repeat} from "lit/directives/repeat.js"
import {shadow, useCss, useSignal} from "@e280/sly"

import styleCss from "./style.css.js"
import {renderTagRow} from "./renderers/row.js"
import {renderColorEditor} from "./renderers/color.js"
import themeCss from "../../../../../../../../theme.css.js"
import addSvg from "../../../../../../../icons/gravity-ui/add.svg.js"
import {deleteTag} from "../../../../../../../logic/modals/tags/modal.js"
import type {EditorContext} from "../../../../../../../../context/context.js"

import "@awesome.me/webawesome/dist/components/input/input.js"
import "@awesome.me/webawesome/dist/components/button/button.js"
import "@awesome.me/webawesome/dist/components/popover/popover.js"
import "@awesome.me/webawesome/dist/components/color-picker/color-picker.js"

export const TagsPanel = shadow((context: EditorContext) => {
	useCss(themeCss, styleCss)

	const draft = useSignal("")
	const color = useSignal("")
	const query = useSignal("")
	const error = useSignal("")
	const {outliner} = context.strata
	const tags = outliner.state.tags
	const term = query().trim().toLowerCase()
	const filteredTags = tags.filter(tag => tag.label.toLowerCase().includes(term))

	const duplicate = (label: string, except?: string) => {
		const name = label.trim().toLowerCase()
		return tags.some(tag => tag.id !== except && tag.label.toLowerCase() === name)
	}

	const create = (event: Event) => {
		outliner.mutate(state => state.tags.push({
			id: context.session.getId(),
			label: draft().trim(),
			...(color() ? {color: color()} : {}),
		}))
		draft("")
		color("")
		void (event.currentTarget as HTMLElement).closest("wa-popover")!.hide()
	}

	const rename = (id: string, label: string) => {
		if (!label || duplicate(label, id)) {
			error("Tag names must be nonempty and unique.")
			return false
		}
		outliner.mutate(state => { state.tags.find(tag => tag.id === id)!.label = label })
		error("")
		return true
	}

	const setColor = (id: string, value: string) => {
		outliner.mutate(state => {
			const tag = state.tags.find(tag => tag.id === id)!
			if (value) tag.color = value
			else delete tag.color
		})
	}

	const search = (event: Event) => {
		query((event.currentTarget as HTMLElementTagNameMap["wa-input"]).value ?? "")
	}

	const nameDraft = (event: Event) => {
		draft((event.currentTarget as HTMLElementTagNameMap["wa-input"]).value ?? "")
	}

	// TODO: should use toast for errors

	return html`
		<div class="panel">
			<div class="toolbar">
				<wa-input class="search" size="small" aria-label="Search tags" placeholder="Search tags..."
					.value=${query()} @input=${search}>
				</wa-input>
				<wa-button id="create-tag" size="small" appearance="plain" aria-label="Create tag" title="Create tag">
					${addSvg}
				</wa-button>
			</div>
			<wa-popover for="create-tag" placement="bottom-end">
				<div class="create">
					<div class="create-row">
						<wa-input size="small" aria-label="Tag name" placeholder="Tag name"
							.value=${draft()} @input=${nameDraft}>
						</wa-input>
						${renderColorEditor(color(), "Tag color", color)}
					</div>
					<wa-button class="save" size="small" ?disabled=${!draft().trim() || duplicate(draft())} @click=${create}>
						Create tag
					</wa-button>
				</div>
			</wa-popover>
			<div class="tag-list">
				${repeat(filteredTags, tag => tag.id, tag => renderTagRow(tag, {
					color: value => setColor(tag.id, value),
					rename: label => rename(tag.id, label),
					remove: () => deleteTag(context, tag, error),
				}))}
			</div>
			${!filteredTags.length ? html`<p class="empty">
				${tags.length ? "No matching tags." : "Create a tag, then assign it to clips or structures in the inspector."}
			</p>` : ""}
			${error() ? html`<p class="error" role="alert">${error()}</p>` : ""}
		</div>
	`
})

