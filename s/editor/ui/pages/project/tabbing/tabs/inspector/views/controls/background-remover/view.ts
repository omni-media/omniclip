
import {html} from "lit"
import {shadow, useCss, useMount, useOnce, useSignal} from "@e280/sly"
import {
	Datafile,
	Item,
	defaultBgRemoverSpec,
	makeBgRemover,
} from "@omnimedia/omnitool"

import {valueOf} from "../filters/utils.js"
import {blobToFrame, frameToPng} from "./utils.js"
import {aiControlStyles, sectionStyles} from "../styles.css.js"
import {EditorContext} from "../../../../../../../../../context/context.js"
import {
	BG_REMOVER_MODELS,
	BgRemover,
	BgRemoverModel,
	bgRemoverWorkerPath,
} from "./constants.js"
import cleanSvg from "../../../../../../../../icons/carbon-icons/clean.svg.js"
import {AI_DEVICES, AI_DTYPES, AiDevice, AiDtype, formatProgress} from "../../../constants.js"

import "@awesome.me/webawesome/dist/components/button/button.js"
import "@awesome.me/webawesome/dist/components/option/option.js"
import "@awesome.me/webawesome/dist/components/select/select.js"
import "@awesome.me/webawesome/dist/components/details/details.js"

export const BackgroundRemoverControls = shadow((context: EditorContext, item: Item.Image) => {
	useCss(sectionStyles, aiControlStyles)

	const canvas = useOnce(() => document.createElement("canvas"))

	const error = useSignal("")
	const status = useSignal("")
	const running = useSignal(false)
	const remover = useSignal<BgRemover | null>(null)
	const model = useSignal<BgRemoverModel>("Xenova/modnet")
	const device = useSignal<AiDevice>("webgpu")
	const dtype = useSignal<AiDtype>("auto")
	const metadata = context.strata.trunk.get().metadata
	const isRemoved = metadata?.items
		?.some(entry => entry.itemId === item.id && entry.bgRemoved) ?? false

	const disposeRemover = () => {
		remover()?.dispose()
		remover(null)
	}

	useMount(() => disposeRemover)
	useMount(() => {
		const disposers = [model, device, dtype]
			.map(item => item.on(disposeRemover))
		return () => disposers.forEach(dispose => dispose())
	})

	const setModel = (value: BgRemoverModel) => {
		if(value !== model())
			model(value)
	}

	const setDtype = (value: AiDtype) => {
		if(value !== dtype())
			dtype(value)
	}

	const setDevice = (value: AiDevice) => {
		if(value !== device())
			device(value)
	}

	const ensureRemover = async () => {
		if (remover.value)
			return remover.value

		remover.value = await makeBgRemover({
			workerUrl: bgRemoverWorkerPath,
			spec: {
				...defaultBgRemoverSpec(),
				model: model.value,
				device: device.value,
				dtype: dtype.value,
			},
			onLoading: ({progress}) => {
				if (!error.value)
					status(formatProgress(Math.round(progress), "Loading background model"))
			}
		})

		return remover.value
	}

	const removeBackground = async () => {
		if (running())
			return

		const media = context.session.deps.resolveMedia(item)
		if (!media) {
			error("Selected image has no media source.")
			return
		}

		error("")
		running(true)
		status("Preparing image...")

		const run = async () => {
			const bgRemover = await ensureRemover()
			const inputFrame = await blobToFrame(media.blob)

			status("Removing background...")

			const outputFrame = await bgRemover
				.remove({frame: inputFrame})
				.finally(() => inputFrame.close())

			status("Saving image...")

			const blob = await frameToPng(canvas, outputFrame).finally(() => outputFrame.close())
			const bytes = new Uint8Array(await blob.arrayBuffer())
			const cask = await context.controllers.cargo.cellar.save(bytes)

			const {removed} = await context.project.load({
				removed: Datafile.make(blob, `${cask.hash}.png`)
			})

			context.omni.set(item.id, {mediaHash: removed.datafile.checksum.hash})
			await context.strata.metadata.mutate(metadata => {
				metadata.items = [
					...metadata.items.filter(entry => entry.itemId !== item.id),
					{itemId: item.id, bgRemoved: true},
				]
			})
			await context.controllers.cargo.refresh()
			status("Background removed.")
		}

		await run().catch(cause => {
			error(cause.message)
			status("")
		})

		running(false)
	}

	return html`
		<wa-details summary="BACKGROUND" icon-placement="start" class="ai-panel">
			<div class="ai-section">
				<div class="ai-hero">
					<div class="ai-icon">${cleanSvg}</div>
					<p class="ai-description">
						${isRemoved ? "Background has been removed" : "Remove image background using AI"}
					</p>
				</div>

				<label class="field-grid">
					<span class="field-label">Model</span>
					<wa-select size="small" .value=${model()}
						?disabled=${running()}
						@change=${(e: Event) => setModel(valueOf(e) as BgRemoverModel)}>
						${BG_REMOVER_MODELS.map(([value, label]) => html`<wa-option value=${value}>${label}</wa-option>`)}
					</wa-select>
				</label>

				<wa-details summary="Advanced" icon-placement="start" class="advanced-panel">
					<div class="advanced-fields">
						<label class="field-grid">
							<span class="field-label">Device</span>
							<wa-select size="small" .value=${device()}
								?disabled=${running()}
								@change=${(e: Event) => setDevice(valueOf(e) as AiDevice)}>
								${AI_DEVICES.map(([value, label]) => html`<wa-option value=${value}>${label}</wa-option>`)}
							</wa-select>
						</label>

						<label class="field-grid">
							<span class="field-label">DType</span>
							<wa-select size="small" .value=${dtype()}
								?disabled=${running()}
								@change=${(e: Event) => setDtype(valueOf(e) as AiDtype)}>
								${AI_DTYPES.map(([value, label]) => html`<wa-option value=${value}>${label}</wa-option>`)}
							</wa-select>
						</label>
					</div>
				</wa-details>

				<div class="action-row">
					<wa-button variant="brand"
						?loading=${running()}
						?disabled=${running()}
						@click=${removeBackground}>
						${isRemoved ? "Run Again" : "Remove Background"}
					</wa-button>
				</div>

				${status() ? html`<div class="status">${status()}</div>` : null}
				${error() ? html`<div class="status" data-error>${error()}</div>` : null}
			</div>
		</wa-details>
	`
})

