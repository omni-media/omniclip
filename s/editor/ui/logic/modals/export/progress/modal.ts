
import type {TimelineFile} from "@omnimedia/omnitool"
import {shadow, useCss, useMount, useOnce, useSignal} from "@e280/sly"

import styleCss from "../style.css.js"
import {ExportResult} from "../constants.js"
import {ExportProgress, renderExportProgress} from "./render.js"
import modalCss from "../../../../../context/parts/modal/modal.css.js"
import {ModalDefinition} from "../../../../../context/parts/modal/types.js"

import "@awesome.me/webawesome/dist/components/button/button.js"

function copyFrame(src: HTMLCanvasElement, dst: HTMLCanvasElement) {
	if (dst.width !== src.width) dst.width = src.width
	if (dst.height !== src.height) dst.height = src.height
	dst.getContext("2d")?.drawImage(src, 0, 0)
}

export const exportProgressModal = (
	settings: ExportResult,
): ModalDefinition<boolean> => ({
	label: "Export Project",

	render: (ctx, modal) => shadow(() => {
		useCss(modalCss, styleCss)

		const progress = useSignal<ExportProgress>({phase: "rendering"})
		const canvas = useOnce(() => document.createElement("canvas"))

		let aborted = false

		const exportVideo = async () => {
			try {
				const {readable} = await ctx.project.render(
					ctx.strata.timeline.state as TimelineFile,
					ctx.strata.settings.state.timebase,
					render => {
						if (aborted)
							throw new Error("Export cancelled.")

						progress({phase: "rendering", render})
						copyFrame(ctx.controllers.player.canvas, canvas)
					},
				)

				if (aborted) return

				progress({phase: "saving"})
				const handle = await window.showSaveFilePicker()
				if (aborted) return

				const writable = await handle.createWritable()
				await readable.pipeTo(writable)
				if (aborted) return

				progress({phase: "complete"})
			}
			catch (error) {
				if (!aborted)
					progress({
						phase: "error",
						error: error instanceof Error ? error.message : "Export failed.",
					})
			}
		}

		useMount(() => {
			exportVideo()
			return () => {aborted = true}
		})

		return renderExportProgress(
			progress.value,
			canvas,
			() => modal.resolve(progress.value.phase === "complete"),
		)
	})()
})

