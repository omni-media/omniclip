
import {html} from "lit"
import {shadow, useCss, useSignal} from "@e280/sly"
import {Item, transitions, type TransitionName} from "@omnimedia/omnitool"

import styleCss from "./style.css.js"
import themeCss from "../../../../../../theme.css.js"
import type {EditorContext} from "../../../../../../context/context.js"
import transitionSvg from "../../../../../icons/transition.svg.js"
import folderSvg from "../../../../../icons/gravity-ui/folder.svg.js"

type BrowserTab = "media" | "transitions"

const DEFAULT_TRANSITION_DURATION = 700

const TRANSITIONS = Object
	.values(transitions)
	.sort((a, b) => a.label.localeCompare(b.label))

export const BrowserTabPanel = shadow((context: EditorContext) => {
	useCss(themeCss, styleCss)

	const query = useSignal("")
	const activeTab = useSignal<BrowserTab>("media")
	const duration = useSignal(DEFAULT_TRANSITION_DURATION)

	const selectedTransition = () => {
		const selectedId = context.session.$selectedItem.value
		const selected = context.session.index.getItemMaybe<Item.Transition>(selectedId)
		return selected
	}

	const setQuery = (event: InputEvent) => {
		query.value = (event.target as HTMLInputElement).value
	}

	const setDuration = (event: InputEvent) => {
		const next = Number((event.target as HTMLInputElement).value)
		if (Number.isFinite(next))
			duration.value = next
	}

	const applyTransition = (name: TransitionName) => {
		context.session.applyTransitionToSelection(name, duration.value)
	}

	const removeTransition = () => {
		const transition = selectedTransition()
		if (!transition)
			return

		context.session.deleteClip(transition.id)
	}

	const renderTabButton = (id: BrowserTab, label: string, icon: unknown) => html`
		<button class="browser-tab" ?data-active=${activeTab.value === id}
			@click=${() => activeTab.value = id}>
			${icon}
			<span>${label}</span>
		</button>
	`

	const renderMedia = () => html`
		<div class="search">
			<input type="search" placeholder="Search media..." />
		</div>
		<p class="placeholder">Media browser will live here.</p>
	`

	const renderTransitions = () => html`
		<div class="browser-controls">
			<div class="search">
				<input
					type="search"
					placeholder="Search transitions..."
					.value=${query()}
					@input=${setQuery}
				/>
			</div>

			<label class="duration-control">
				<span>Duration</span>
				<input
					type="number"
					min="1"
					step="50"
					.value=${String(duration())}
					@input=${setDuration}
				/>
				<span>ms</span>
			</label>
		</div>

		<div class="section-label">All transitions</div>

		<div class="transition-grid">
			${TRANSITIONS
				.filter(transition => transition.label.toLowerCase().includes(query.value.trim().toLowerCase()))
				.map(transition => html`
				<button class="transition-card"
					?data-active=${selectedTransition()?.name === transition?.name}
					title=${transition.label}
					@click=${() => applyTransition(transition.name)}>
					<div class="transition-preview" aria-hidden="true"></div>
					<div class="transition-name">${transition.label}</div>
					<div class="transition-meta">${duration()} ms</div>
				</button>
			`)}
		</div>
	`

	const renderBody = () => {
		switch (activeTab()) {
			case "media": return renderMedia()
			case "transitions": return renderTransitions()
		}
	}

	return html`
		<div class="browser">
			<nav class="browser-tabs">
				${renderTabButton("media", "Media", folderSvg)}
				${renderTabButton("transitions", "Transitions", transitionSvg)}
			</nav>

			<div class="browser-body">
				${renderBody()}
			</div>
		</div>
	`
})

