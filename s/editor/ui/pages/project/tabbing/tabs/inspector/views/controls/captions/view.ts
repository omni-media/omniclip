
import {html} from "lit"
import type {TextStyleOptions} from "pixi.js"
import {shadow, useCss, useMount, useSignal} from "@e280/sly"
import {
	Item,
	Kind,
	makeTranscriber,
	type Transcription,
	defaultTranscriberSpec,
} from "@omnimedia/omnitool"

import styleCss from "./style.css.js"
import {valueOf} from "../filters/utils.js"
import textStyleCss from "../text/style.css.js"
import {aiControlStyles, sectionStyles} from "../styles.css.js"
import binSvg from "../../../../../../../../icons/gravity-ui/bin.svg.js"
import {EditorContext} from "../../../../../../../../../context/context.js"
import speechToTextSvg from "../../../../../../../../icons/speech-to-text.svg.js"
import {renderCaptionStyleControls, renderTranscriptPreview} from "./renderers.js"
import {replaceChild} from "../../../../../../../../logic/parts/operations/operations.js"
import {AI_DEVICES, AI_DTYPES, AiDevice, AiDtype, formatProgress} from "../../../constants.js"
import {CaptionConfigKey, LANGUAGES, Transcriber, TranscriberModel, TRANSCRIBER_MODELS, transcriberWorkerPath} from "./constants.js"

import "@awesome.me/webawesome/dist/components/button/button.js"
import "@awesome.me/webawesome/dist/components/option/option.js"
import "@awesome.me/webawesome/dist/components/select/select.js"
import "@awesome.me/webawesome/dist/components/details/details.js"
import "@awesome.me/webawesome/dist/components/number-input/number-input.js"


export const CaptionsControls = shadow((context: EditorContext, item: Item.Video | Item.Audio) => {
	useCss(sectionStyles, textStyleCss, aiControlStyles, styleCss)

	const tool = context.omni
	const index = context.session.index
	const existingCaption = index.queryItem<Item.Caption>(
		c => c.kind === Kind.Caption && c.itemId === item.id
	)
	const styleItem = index.getItemMaybe<Item.TextStyle>(existingCaption?.styleId)

	const error = useSignal("")
	const status = useSignal("")
	const language = useSignal("")
	const generating = useSignal(false)
	const transcriber = useSignal<Transcriber | null>(null)
	const model = useSignal<TranscriberModel>(TRANSCRIBER_MODELS[0][0])
	const device = useSignal<AiDevice>("webgpu")
	const dtype = useSignal<AiDtype>("auto")
	const maxChars = useSignal(existingCaption?.maxChars ?? 42)
	const maxDuration = useSignal(existingCaption?.maxDuration ?? 3500)
	const maxSilence = useSignal(existingCaption?.maxSilence ?? 750)
	const transcript = useSignal<Transcription | null>(existingCaption?.transcript ?? null)

	const disposeTranscriber = () => {
		transcriber()?.dispose()
		transcriber(null)
	}

	useMount(() => disposeTranscriber)
	useMount(() => {
		const disposers = [model, device, dtype]
			.map(item => item.on(disposeTranscriber))
		return () => disposers.forEach(dispose => dispose())
	})

	const setModel = (value: TranscriberModel) => {
		if (value !== model())
			model(value)
	}

	const setDevice = (value: AiDevice) => {
		if (value !== device())
			device(value)
	}

	const setDtype = (value: AiDtype) => {
		if (value !== dtype())
			dtype(value)
	}

	const updateCaption = (patch: Partial<Item.Caption>) => {
		if (existingCaption)
			tool.set(existingCaption.id, patch)
	}

	const setCaptionConfig = (key: CaptionConfigKey, value: number) => {
		const next = Math.max(1, Math.round(value) || 1);
		({maxChars, maxDuration, maxSilence})[key].value = next
		updateCaption({[key]: next})
	}

	const updateStyle = (item: Item.TextStyle, style: TextStyleOptions) =>
		tool.set(item.id, {style: {...item.style, ...style}})

	const ensureTranscriber = async () => {
		if (transcriber.value)
			return transcriber.value

		transcriber.value = await makeTranscriber({
			driver: context.driver,
			workerUrl: transcriberWorkerPath,
			spec: {
				...defaultTranscriberSpec(),
				model: model.value,
				device: device.value,
				dtype: dtype.value,
			},
			onLoading: ({progress}) => {
				if (!error.value)
					status(formatProgress(Math.round(progress), "Loading speech model"))
			}
		})

		return transcriber.value
	}

	const insertCaption = (caption: Item.Caption) => {
		const parent = context.session.index.getParent(item.id)
		if (parent?.kind === Kind.Stack)
			tool.set(parent.id, {childrenIds: [caption.id, ...parent.childrenIds]})
		else {
			const stack = context.omni.stack(caption, item)
			if (parent)
				tool.set(parent.id, {childrenIds: replaceChild(parent.childrenIds, item.id, [stack.id])})
			else context.strata.timeline.mutate(s => s.rootId = stack.id)
		}
	}

	const generate = async () => {
  	if (generating() || existingCaption)
			return

  	const media = context.session.deps.resolveMedia(item)
  	if (!media) {
			error("Selected item has no media source.")
			return
		}

  	error("")
  	generating(true)
  	status("Preparing transcription...")

  	const run = async () => {
    	const transcriber = await ensureTranscriber()
    	const nextTranscript = await transcriber.transcribe({
      	source: media.blob,
      	language: language.value,
      	onTranscription: text => {
      		if (!error.value && text.trim())
      			status(text)
      	},
      	onReport: ({progress}) => {
      		if (!error.value)
      			status(formatProgress(Math.round(progress), "Transcribing"))
      	}
    	})
    	const caption = context.omni.captions.make(nextTranscript, {
      	itemId: item.id,
      	start: item.start,
      	duration: item.duration,
      	maxChars: maxChars.value,
      	maxDuration: maxDuration.value,
      	maxSilence: maxSilence.value,
    	})
    	insertCaption(caption)
    	status("Subtitles generated.")
    	context.session.$selectedItem(item.id)
  	}

  	await run().catch(cause => {
    	error(cause.message)
    	status("")
  	})

  	generating(false)
	}

	const removeCaption = async () => {
		if (existingCaption) {
			context.session.deleteClip(existingCaption.id)
			transcript(null)
			status("Subtitles removed.")
			error("")
		}
	}

	const numField = (label: string, key: CaptionConfigKey, step: number, max?: number) => html`
		<label class="field-grid">
			<span class="field-label">${label}</span>
			<wa-number-input size="small" min="1" step=${step} max=${max ?? ""}
				.value=${String(({maxChars, maxDuration, maxSilence})[key].value)}
				@input=${(e: Event) => setCaptionConfig(key, Number(valueOf(e)))}
			></wa-number-input>
		</label>
	`

	return html`
		<wa-details summary="SUBTITLES" icon-placement="start" class="ai-panel">
			<div class="ai-section">
				<div class="ai-hero">
					<div class="ai-icon">${speechToTextSvg}</div>
					<p class="ai-description">Transcribe audio using AI</p>
				</div>

				<label class="field-grid">
					<span class="field-label">Source Language</span>
					<wa-select size="small" .value=${language()}
						@change=${(e: Event) => language(valueOf(e))}>
						${LANGUAGES.map(([value, label]) => html`<wa-option value=${value}>${label}</wa-option>`)}
					</wa-select>
				</label>

				<label class="field-grid">
					<span class="field-label">Model</span>
					<wa-select size="small" .value=${model()}
						?disabled=${generating()}
						@change=${(e: Event) => setModel(valueOf(e) as TranscriberModel)}>
						${TRANSCRIBER_MODELS.map(([value, label]) => html`<wa-option value=${value}>${label}</wa-option>`)}
					</wa-select>
				</label>

				<label class="field-grid">
					<span class="field-label">Style</span>
					<wa-select size="small" value="default">
						<wa-option value="default">Default</wa-option>
					</wa-select>
				</label>

				<wa-details summary="Advanced" icon-placement="start" class="advanced-panel">
					<div class="advanced-fields">
						<label class="field-grid">
							<span class="field-label">Device</span>
							<wa-select size="small" .value=${device()}
								?disabled=${generating()}
								@change=${(e: Event) => setDevice(valueOf(e) as AiDevice)}>
								${AI_DEVICES.map(([value, label]) => html`<wa-option value=${value}>${label}</wa-option>`)}
							</wa-select>
						</label>

						<label class="field-grid">
							<span class="field-label">DType</span>
							<wa-select size="small" .value=${dtype()}
								?disabled=${generating()}
								@change=${(e: Event) => setDtype(valueOf(e) as AiDtype)}>
								${AI_DTYPES.map(([value, label]) => html`<wa-option value=${value}>${label}</wa-option>`)}
							</wa-select>
						</label>

						${numField("Max Chars", "maxChars", 1, 160)}
						${numField("Max Duration", "maxDuration", 100)}
						${numField("Max Silence", "maxSilence", 50)}
					</div>
				</wa-details>

				<div class="action-row">
					<wa-button variant="brand"
						?loading=${generating()}
						?disabled=${generating() || Boolean(existingCaption)}
						@click=${generate}>
						Generate Subtitles
					</wa-button>
					${existingCaption ? html`
						<button class="icon-button" title="Remove subtitles"
							?disabled=${generating()}
							@click=${removeCaption}>
							${binSvg}
						</button>
					` : null}
				</div>

				${status() ? html`<div class="status">${status()}</div>` : null}
				${error() ? html`<div class="status" data-error>${error()}</div>` : null}
			</div>

			<div class="preview ai-section">
				<div class="section-label">Preview</div>
				${renderTranscriptPreview(transcript(), maxChars())}
			</div>

			<div class="text-styles ai-section">
				<div class="section-label">Style</div>
				${renderCaptionStyleControls(styleItem, updateStyle)}
			</div>
		</wa-details>
	`
})

