
import {html} from "lit"
import {shadow, useCss, useOnce, useSignal, useMount} from "@e280/sly"
import {Item, Media, O, transform, type Transition} from "@omnimedia/omnitool"
import {components as quayComponents, dom, type MediaFormat, type MediaLibrary} from "@e280/quay"

import styleCss from "./style.css.js"
import {setupMediaGroup} from "./setup.js"
import {MediaDrag} from "./drag-drop.js"
import {Breadcrumb} from "./views/breadcrumb.js"
import {MediaSearch} from "./search/controller.js"
import themeCss from "../../../../../../theme.css.js"
import aiSearchCss from "./renderers/search/style.css.js"
import {createAiSearch} from "./renderers/search/renderer.js"
import {type MediaItem} from "./views/media-item-preview/view.js"
import textSvg from "../../../../../icons/gravity-ui/text.svg.js"
import transitionSvg from "../../../../../icons/transition.svg.js"
import folderSvg from "../../../../../icons/gravity-ui/folder.svg.js"
import type {EditorContext} from "../../../../../../context/context.js"
import {transitionDropTargets} from "../edit/canvas/drop_targets/transition.js"
import {BrowserTab, DEFAULT_TEXT_DURATION, DEFAULT_TRANSITION_DURATION, MEDIA_GROUP, TEXT_PRESETS, TextPreset, TRANSITIONS} from "./constants.js"

dom.register(quayComponents, {soft: true})

export const BrowserTabPanel = shadow((context: EditorContext) => {
	useCss(themeCss, aiSearchCss, styleCss)

	const cargo = context.controllers.cargo
	const mediaDrag = useOnce(() => new MediaDrag(cargo.editorLibrary, cargo.projectLibrary))
	const projectFolder = () => cargo.projectLibrary.trail.signal().at(-1) ?? cargo.projectLibrary.config.root
	const projectDrop = mediaDrag.target(cargo.projectLibrary, projectFolder, cargo.editorLibrary)
	const aiSearch = useOnce(() => new MediaSearch([cargo.projectLibrary, cargo.editorLibrary]))
	useMount(() => () => aiSearch.dispose())

	const query = useSignal("")
	const activeTab = useSignal<BrowserTab>("media")
	const mediaScope = useSignal<"project" | "all">("project")
	const duration = useSignal(DEFAULT_TRANSITION_DURATION)

	const makeItem = (omni: O, format: Exclude<MediaFormat, "other">, media: Media) => {
		const label = media.datafile.filename
		switch (format) {
			case "video": return media.hasAudio
				? omni.clip(media, {label})
				: omni.video(media, {label})
			case "image": return omni.image(media, {label})
			case "audio": return omni.audio(media, {label})
		}
	}

	const addMedia = async(event: Event, item: MediaItem) => {
		event.preventDefault()
		event.stopPropagation()

		if (!item.isKind("file"))
			return
		const format = item.specimen.format
		if (format === "other")
			return

		const hash = item.specimen.hash!
		await cargo.projectLibrary.include(hash)
		const {specimen: {mime, label}} = item
		const media = await cargo.loadMedia({hash, mime, label})

		// TODO: should be toast instead
		const added = context.session.appendItem(omni => makeItem(omni, format, media))
		if (!added)
			alert("This structure's rules do not allow that media type.")
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

		// TODO: should be toast instead
		if (inUse) {
			alert("Remove clips using this media before removing it from the bin.")
			return
		}

		await library.delete(item)
		if (hash && library === cargo.editorLibrary)
			await aiSearch.removeIndex(hash)
	}

	useOnce(() => {
		setupMediaGroup({
			group: `${MEDIA_GROUP}-project`,
			library: cargo.projectLibrary,
			drag: mediaDrag,
			onAdd: addMedia,
			onRemove: (event, item) => removeMedia(event, item, cargo.projectLibrary),
		})
		setupMediaGroup({
			group: `${MEDIA_GROUP}-all`,
			library: cargo.editorLibrary,
			drag: mediaDrag,
			onAdd: addMedia,
			onRemove: (event, item) => removeMedia(event, item, cargo.editorLibrary),
		})
	})

	const setQuery = (event: InputEvent) => {
		query((event.target as HTMLInputElement).value)
	}

	const setDuration = (event: InputEvent) => {
		const next = Number((event.target as HTMLInputElement).value)
		if (Number.isFinite(next))
			duration(next)
	}

	const dragTransition = (event: DragEvent, transition: Transition) => {
		const canvas = context.session.canvas
		canvas.dragDrop.start(event, {
			targets: transitionDropTargets(canvas),
			drop: ({targetId}) => context.session.applyTransitionAt(transition.name, duration(), targetId),
		})
	}

	const addTextPreset = (preset: TextPreset) => {
		const text = context.session.appendItem(omni => {
			const text = omni.text(preset.content, {
				duration: DEFAULT_TEXT_DURATION,
				label: preset.label,
				styles: preset.styles,
			})

			if (preset.relativePosition) {
				const [width, height] = context.strata.settings.state.resolution.split("x").map(Number)
				const [x, y] = preset.relativePosition
				const spatial = omni.spatial(transform({
					position: [width * x, height * y],
				}))
				omni.set<Item.Text>(text.id, {spatialId: spatial.id})
			}
			return text
		})
		// TODO: should be toast instead
		if (!text) {
			alert("This structure's rules do not allow text items.")
			return
		}
		const start = context.session.index.getItemLaneStart(text.id, context.session.$viewedItemId())
		context.session.seekPlayhead(start)
		context.session.viewport.revealTime(start)
	}

	const renderTabButton = (id: BrowserTab, label: string, icon: unknown) => html`
		<button class="browser-tab" ?data-active=${activeTab() === id}
			@click=${() => activeTab(id)}>
			${icon}
			<span>${label}</span>
		</button>
	`

	const renderAiSearch = createAiSearch(aiSearch)

	const renderMediaTools = (scope: "project" | "all", library: MediaLibrary) => html`
		<div class="media-toolbar">
			<div class="search media-search" @focusin=${() => {
				if (mediaScope() === scope) return
				mediaScope(scope)
				aiSearch.select(library)
			}}>
				<input type="search" aria-label="Search media"
					placeholder=${aiSearch.enabled() && mediaScope() === scope ? "Describe your media…" : "Search media…"}
					.value=${library.searchText()}
					@input=${(event: InputEvent) => library.searchText((event.target as HTMLInputElement).value)}>
				${renderAiSearch(`media-ai-search-${scope}`)}
			</div>
			<quay-filter no-caret></quay-filter>
			<quay-sort no-caret></quay-sort>
		</div>
	`

	const renderMediaLibrary = (library: MediaLibrary, drop?: ReturnType<MediaDrag["target"]>) => html`
		<div class="media-library">
			<div class="folder-toolbar">
				${Breadcrumb(library, mediaDrag)}
				<sl-tooltip class="media-tooltip" content="New folder">
					<button class="new-folder" type="button" aria-label="New folder" @click=${() => {
						const folder = library.trail.signal().at(-1) ?? library.config.root
						void library.addFolder(folder).catch(error => alert(error instanceof Error ? error.message : String(error)))
					}}><sl-icon name="folder-plus"></sl-icon></button>
				</sl-tooltip>
			</div>
			<quay-browser tiles-only
				@dragover=${drop?.dragover}
				@dragleave=${drop?.dragleave}
				@drop=${drop?.drop}>
			</quay-browser>
		</div>
	`

	const renderMedia = () => html`
		<div class="media-bin">
			<sl-tooltip class="media-tooltip" content="Click to browse files">
				<quay-dropzone group=${`${MEDIA_GROUP}-project`}></quay-dropzone>
			</sl-tooltip>
			<wa-details open summary="Project Bin" icon-placement="start" group=${`${MEDIA_GROUP}-project`}
				?data-drop-target=${projectDrop.hovering}>
				${renderMediaTools("project", cargo.projectLibrary)}
				${renderMediaLibrary(cargo.projectLibrary, projectDrop)}
			</wa-details>
			<wa-details summary="All Media" icon-placement="start" group=${`${MEDIA_GROUP}-all`}>
				${renderMediaTools("all", cargo.editorLibrary)}
				${renderMediaLibrary(cargo.editorLibrary)}
			</wa-details>
		</div>
	`

	const renderTransitions = () => {
		const selected = context.session.index.getItemMaybe<Item.Transition>(context.session.$selectedItem())

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
					.filter(transition => transition.label.toLowerCase().includes(query().trim().toLowerCase()))
					.map(transition => html`
					<button class="transition-card"
						draggable="true"
						?data-active=${selected?.name === transition?.name}
						title=${transition.label}
						@dragstart=${(event: DragEvent) => dragTransition(event, transition)}
						@dragend=${context.session.canvas.dragDrop.end}
						@click=${() => context.session.applyTransitionToSelection(transition.name, duration())}>
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
			<div class="browser-header">
				<nav class="browser-tabs">
					${renderTabButton("media", "Media", folderSvg)}
					${renderTabButton("transitions", "Transitions", transitionSvg)}
					${renderTabButton("text", "Text", textSvg)}
				</nav>
			</div>

			<div class="browser-body" @dragover=${mediaDrag.autoScroll}>
				${renderBody()}
			</div>
		</div>
	`
})

