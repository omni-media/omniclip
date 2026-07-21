
import {html} from "lit"
import {Datafile, Item, Media} from "@omnimedia/omnitool"
import {shadow, useCss, useOnce, useSignal} from "@e280/sly"
import {components as quayComponents, dom, type MediaFormat} from "@e280/quay"

import styleCss from "./style.css.js"
import {setupMediaGroup} from "./setup.js"
import themeCss from "../../../../../../theme.css.js"
import {type MediaItem} from "./views/media-item-preview/view.js"
import textSvg from "../../../../../icons/gravity-ui/text.svg.js"
import transitionSvg from "../../../../../icons/transition.svg.js"
import folderSvg from "../../../../../icons/gravity-ui/folder.svg.js"
import type {EditorContext} from "../../../../../../context/context.js"
import {BrowserTab, DEFAULT_TEXT_DURATION, DEFAULT_TRANSITION_DURATION, MEDIA_GROUP, TEXT_PRESETS, TextPreset, TRANSITIONS} from "./constants.js"

dom.register(quayComponents, {soft: true})

export const BrowserTabPanel = shadow((context: EditorContext) => {
	useCss(themeCss, styleCss)

	const query = useSignal("")
	const activeTab = useSignal<BrowserTab>("media")
	const duration = useSignal(DEFAULT_TRANSITION_DURATION)

	const makeItems = (format: MediaFormat, media: Media) => {
		switch (format) {
			case "video": {
				const video = context.omni.video(media)
				return media.hasAudio
					? [context.omni.audio(media), video]
					: [video]
			}
			case "image": return [context.omni.image(media)]
			case "audio": return [context.omni.audio(media)]
			case "other": return []
		}
	}

	const addMedia = async(event: Event, item: MediaItem) => {
		event.preventDefault()
		event.stopPropagation()

		if (!item.isKind("file"))
			return

		const file = await context.controllers.cargo.loadMedia(item.specimen.hash!)

		const {specimen: {mime, label}} = item
		const {media} = await context.project.load({
			media: Datafile.make(new Blob([file], {type: mime}), label),
		})

		for (const clip of makeItems(item.specimen.format, media))
			context.session.appendItem(clip)
	}

	const removeMedia = async(event: Event, item: MediaItem) => {
		event.preventDefault()
		event.stopPropagation()

		if (!item.isKind("file"))
			return

		const {hash} = item.specimen
		const inUse = context.strata.timeline.state.items.some(item =>
			"mediaHash" in item && item.mediaHash === hash
		)

		if (inUse) {
			alert("Remove clips using this media before removing it from the bin.")
			return
		}

		await context.controllers.cargo.mediaLibrary.delete(item)
	}

	useOnce(() => setupMediaGroup(context, addMedia, removeMedia))

	const setQuery = (event: InputEvent) => {
		query.value = (event.target as HTMLInputElement).value
	}

	const setDuration = (event: InputEvent) => {
		const next = Number((event.target as HTMLInputElement).value)
		if (Number.isFinite(next))
			duration.value = next
	}

	const addTextPreset = (preset: TextPreset) => {
		const text = context.omni.text(preset.content, {
			duration: DEFAULT_TEXT_DURATION,
			styles: preset.styles,
		})

		context.session.appendItem(text)
	}

	const renderTabButton = (id: BrowserTab, label: string, icon: unknown) => html`
		<button class="browser-tab" ?data-active=${activeTab.value === id}
			@click=${() => activeTab.value = id}>
			${icon}
			<span>${label}</span>
		</button>
	`

	const renderMedia = () => html`
		<div class="media-bin" group=${MEDIA_GROUP}>
			<div class="media-toolbar">
				<quay-searchbar></quay-searchbar>
				<quay-filter></quay-filter>
				<quay-sort></quay-sort>
			</div>
			<quay-dropzone></quay-dropzone>
			<div class="media-path">
				<quay-breadcrumb></quay-breadcrumb>
			</div>
			<quay-browser></quay-browser>
		</div>
	`

	const renderTransitions = () => {
		const selected = context.session.index.getItemMaybe<Item.Transition>(context.session.$selectedItem.value)

		return html`
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
						?data-active=${selected?.name === transition?.name}
						title=${transition.label}
						@click=${() => context.session.applyTransitionToSelection(transition.name, duration.value)}>
						<div class="transition-preview" aria-hidden="true"></div>
						<div class="transition-name">${transition.label}</div>
						<div class="transition-meta">${duration()} ms</div>
					</button>
				`)}
			</div>
		`
	}

	const renderText = () => html`
		<div class="section-label">Text presets</div>

		<div class="preset-grid">
			${TEXT_PRESETS.map(preset => html`
				<button class="preset-card"
					title=${preset.label}
					@click=${() => addTextPreset(preset)}>
					<div class="text-preview"
						style="
							font-size: ${Number(preset.styles.fontSize ?? 48) / 3}px;
							font-weight: ${preset.styles.fontWeight ?? "600"};
						"
					>
						${preset.content}
					</div>
					<div class="transition-name">${preset.label}</div>
					<div class="transition-meta">${DEFAULT_TEXT_DURATION / 1000}s text</div>
				</button>
			`)}
		</div>
	`

	const renderBody = () => {
		switch (activeTab()) {
			case "media": return renderMedia()
			case "transitions": return renderTransitions()
			case "text": return renderText()
		}
	}

	return html`
		<div class="browser">
			<nav class="browser-tabs">
				${renderTabButton("media", "Media", folderSvg)}
				${renderTabButton("transitions", "Transitions", transitionSvg)}
				${renderTabButton("text", "Text", textSvg)}
			</nav>

			<div class="browser-body">
				${renderBody()}
			</div>
		</div>
	`
})

