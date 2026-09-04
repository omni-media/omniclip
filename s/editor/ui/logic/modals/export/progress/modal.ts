
import type {TimelineFile} from "@omnimedia/omnitool"
import {shadow, useCss, useMount, useOnce, useSignal} from "@e280/sly"

import styleCss from "../style.css.js"
import {ExportResult} from "../constants.js"
import {copyFrame, toOmnitoolExportConfig} from "./utils.js"
import {ExportProgress, renderExportProgress} from "./render.js"
import modalCss from "../../../../../context/parts/modal/modal.css.js"
import {ModalDefinition} from "../../../../../context/parts/modal/types.js"

import "@awesome.me/webawesome/dist/components/button/button.js"

export const exportProgressModal = (
	settings: ExportResult,
	timeline: TimelineFile,
): ModalDefinition<boolean> => ({
	label: "Export",

	render: (ctx, modal) => shadow(() => {
		useCss(modalCss, styleCss)

		const progress = useSignal<ExportProgress>({phase: "rendering"})
		const canvas = useOnce(() => document.createElement("canvas"))

		let aborted = false

		const exportVideo = async () => {
			try {
				const handle = await window.showSaveFilePicker({
					suggestedName: `export.${settings.format}`,
				})
				if (aborted) return

				const writable = await handle.createWritable()
				const {readable, done} = await ctx.project.render(
					timeline,
					{
						config: toOmnitoolExportConfig(
							settings,
							ctx.strata.settings.state.timebase,
						),
						onProgress: render => {
							if (aborted)
								throw new Error("Export cancelled.")
							if (progress.value.phase !== "rendering")
								return

							progress({phase: "rendering", render})
							copyFrame(ctx.controllers.player.canvas, canvas)
						},
					},
				)

				if (aborted) return
				await Promise.all([readable.pipeTo(writable), done])
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

