
import {html} from "lit"
import {shadow, useCss, useMount, useOnce, useSignal} from "@e280/sly"
import {
	Datafile,
	Item,
	defaultBgRemoverSpec,
	makeBgRemover,
} from "@omnimedia/omnitool"

import {sectionStyles} from "../styles.css.js"
import styleCss from "../captions/style.css.js"
import {blobToFrame, frameToPng} from "./utils.js"
import {EditorContext} from "../../../../../../../../../context/context.js"
import {BgRemover, bgRemoverWorkerPath, formatProgress} from "./constants.js"
import cleanSvg from "../../../../../../../../icons/carbon-icons/clean.svg.js"

import "@awesome.me/webawesome/dist/components/button/button.js"
import "@awesome.me/webawesome/dist/components/details/details.js"

export const BackgroundRemoverControls = shadow((context: EditorContext, item: Item.Image) => {
	useCss(sectionStyles, styleCss)

	const canvas = useOnce(() => document.createElement("canvas"))

	const error = useSignal("")
	const status = useSignal("")
	const running = useSignal(false)
	const remover = useSignal<BgRemover | null>(null)
	const metadata = context.strata.trunk.get().metadata
	const isRemoved = metadata?.items?.some(entry => entry.itemId === item.id && entry.bgRemoved) ?? false

	const disposeRemover = () => {
		remover()?.dispose()
		remover(null)
	}

	useMount(() => disposeRemover)

	const ensureRemover = async () => {
		if (remover.value)
			return remover.value

		remover.value = await makeBgRemover({
			workerUrl: bgRemoverWorkerPath,
			spec: defaultBgRemoverSpec(),
			onLoading: ({progress}) => status(formatProgress(Math.round(progress), "Loading background model"))
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
		<wa-details summary="BACKGROUND" icon-placement="start" class="captions-panel">
			<div class="transcribe section">
				<div class="caption-hero">
					<div class="caption-icon">${cleanSvg}</div>
					<p class="caption-description">
						${isRemoved ? "Background has been removed" : "Remove image background using AI"}
					</p>
				</div>

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

