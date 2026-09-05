
import {html} from "lit"
import {keyed} from "lit/directives/keyed.js"
import {shadow, useCss, useOnce, useSignal} from "@e280/sly"
import {Datafile, Item, Media, type Transition} from "@omnimedia/omnitool"
import {components as quayComponents, dom, type MediaFormat, type MediaLibrary} from "@e280/quay"

import styleCss from "./style.css.js"
import {setupMediaGroup} from "./setup.js"
import themeCss from "../../../../../../theme.css.js"
import {type MediaItem} from "./views/media-item-preview/view.js"
import textSvg from "../../../../../icons/gravity-ui/text.svg.js"
import transitionSvg from "../../../../../icons/transition.svg.js"
import folderSvg from "../../../../../icons/gravity-ui/folder.svg.js"
import type {EditorContext} from "../../../../../../context/context.js"
import {transitionDropTargets} from "../edit/canvas/drop_targets/transition.js"
import {BrowserTab, DEFAULT_TEXT_DURATION, DEFAULT_TRANSITION_DURATION, MEDIA_GROUP, TEXT_PRESETS, TextPreset, TRANSITIONS} from "./constants.js"

dom.register(quayComponents, {soft: true})

export const BrowserTabPanel = shadow((context: EditorContext) => {
	useCss(themeCss, styleCss)

	const cargo = context.controllers.cargo

	const query = useSignal("")
	const activeTab = useSignal<BrowserTab>("media")
	const mediaScope = useSignal<"project" | "all">("project")
	const duration = useSignal(DEFAULT_TRANSITION_DURATION)

	const makeItems = (format: MediaFormat, media: Media) => {
		const label = media.datafile.filename
		switch (format) {
			case "video": return [
				media.hasAudio
					? context.omni.clip(media, {label})
					: context.omni.video(media, {label}),
			]
			case "image": return [context.omni.image(media, {label})]
			case "audio": return [context.omni.audio(media, {label})]
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
			media: Datafile.make(new Blob([file], {type: mime}), {
				filename: label,
				hash: item.specimen.hash,
			}),
		})

		for (const clip of makeItems(item.specimen.format, media))
			context.session.appendItem(clip)
	}

	const removeMedia = async(event: Event, item: MediaItem, library: MediaLibrary) => {
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

		await library.delete(item)
	}

	useOnce(() => {
		setupMediaGroup({
			group: `${MEDIA_GROUP}-project`,
			library: cargo.projectLibrary,
			onAdd: addMedia,
			onRemove: (event, item) => removeMedia(event, item, cargo.projectLibrary),
		})
		setupMediaGroup({
			group: `${MEDIA_GROUP}-all`,
			library: cargo.editorLibrary,
			onAdd: addMedia,
			onRemove: (event, item) => removeMedia(event, item, cargo.editorLibrary),
		})
	})

	const setQuery = (event: InputEvent) => {
		query.value = (event.target as HTMLInputElement).value
	}

	const setDuration = (event: InputEvent) => {
		const next = Number((event.target as HTMLInputElement).value)
		if (Number.isFinite(next))
			duration.value = next
	}

	const dragTransition = (event: DragEvent, transition: Transition) => {
		const canvas = context.session.canvas
		canvas.dragDrop.start(event, {
			targets: transitionDropTargets(canvas),
			drop: ({targetId}) => context.session.applyTransitionAt(transition.name, duration.value, targetId),
		})
	}

	const addTextPreset = (preset: TextPreset) => {
		const text = context.omni.text(preset.content, {
			duration: DEFAULT_TEXT_DURATION,
			label: preset.label,
			styles: preset.styles,
		})

		if (preset.relativePosition) {
			const [width, height] = context.strata.settings.state.resolution.split("x").map(Number)
			const [x, y] = preset.relativePosition
			const spatial = context.omni.spatial(context.omni.transform({
				position: [width * x, height * y],
			}))
			context.omni.set<Item.Text>(text.id, {spatialId: spatial.id})
		}

		context.session.appendItem(text)
		const start = context.session.index.getItemLaneStart(text.id, context.session.$viewedItemId.value)
		context.session.seekPlayhead(start)
		context.session.viewport.revealTime(start)
	}

	const renderTabButton = (id: BrowserTab, label: string, icon: unknown) => html`
		<button class="browser-tab" ?data-active=${activeTab.value === id}
			@click=${() => activeTab.value = id}>
			${icon}
			<span>${label}</span>
		</button>
	`

	const renderMediaPath = () => html`
		<nav class="media-path" aria-label="Media location">
			<button ?data-current=${mediaScope() === "all"} @click=${() => mediaScope("all")}>Library</button>
			<span>/</span>
			<button ?data-current=${mediaScope() === "project"} @click=${() => mediaScope("project")}>Project</button>
		</nav>
	`

	const renderMedia = () => keyed(mediaScope(), html`
		<div class="media-bin" group=${`${MEDIA_GROUP}-${mediaScope()}`}>
			<div class="media-toolbar">
				<quay-searchbar></quay-searchbar>
				<quay-filter></quay-filter>
				<quay-sort></quay-sort>
			</div>
			<quay-dropzone group=${`${MEDIA_GROUP}-project`}></quay-dropzone>
			${renderMediaPath()}
			<quay-browser></quay-browser>
		</div>
	`)

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
						draggable="true"
						?data-active=${selected?.name === transition?.name}
						title=${transition.label}
						@dragstart=${(event: DragEvent) => dragTransition(event, transition)}
						@dragend=${context.session.canvas.dragDrop.end}
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

