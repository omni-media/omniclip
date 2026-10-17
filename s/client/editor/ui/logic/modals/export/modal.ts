
import {html} from "lit"
import {TimelineFile, Ms} from "@omnimedia/omnitool"
import {shadow, useCss, useSignal} from "@e280/sly"

import styleCss from "./style.css.js"
import {exportProgressModal} from "./progress/modal.js"
import type {EditorContext} from "../../../../context/context.js"
import modalCss from "../../../../context/parts/modal/modal.css.js"
import {ModalDefinition} from "../../../../context/parts/modal/types.js"
import {codecOptions, ExportCodec, ExportResult, qualityOptions, getQualityLabel, codecSupportedFormats, ExportFormat, ExportBitrate} from "./constants.js"

import "@awesome.me/webawesome/dist/components/icon/icon.js"
import "@awesome.me/webawesome/dist/components/button/button.js"
import "@awesome.me/webawesome/dist/components/input/input.js"
import "@awesome.me/webawesome/dist/components/option/option.js"
import "@awesome.me/webawesome/dist/components/select/select.js"

export async function openExport(context: EditorContext, timeline: TimelineFile) {
	const settings = await context.modals.openModal(exportModal(timeline))
	if (settings)
		await context.modals.openModal(exportProgressModal(settings, timeline))
}

export const exportModal = (timeline: TimelineFile): ModalDefinition<ExportResult> => ({
	label: html`
		<div class="header">
			<wa-icon name="download"></wa-icon>
			<span>Export</span>
		</div>
	`,

	render: (ctx, modal) => shadow(() => {
		useCss(modalCss, styleCss)

		const state = ctx.strata.settings.state

		const selectedCodec = useSignal<ExportCodec>("h264")
		const selectedFormat = useSignal<ExportFormat>("mp4")
		const selectedQuality = useSignal<ExportBitrate>("high")

		const initialBitrate = qualityOptions.find(o => o.value === "high")?.kbps ?? 8000
		const bitrate = useSignal<number>(initialBitrate)

		const setQuality = (e: Event) => {
			const target = e.target as HTMLSelectElement
			const quality = target.value as ExportBitrate
			selectedQuality(quality)

			const preset = qualityOptions.find(o => o.value === quality)
			if (preset)
				bitrate(preset.kbps)
		}

		const setBitrate = (e: Event) => {
			const target = e.target as HTMLSelectElement
			bitrate(+target.value)
		}

		const setCodec = (e: Event) => {
			const target = e.target as HTMLSelectElement
			const codec = target.value as ExportCodec
			selectedCodec(codec)
			selectedFormat(codecSupportedFormats[codec][0])
		}

		const setFormat = (e: Event) => {
			const target = e.target as HTMLSelectElement
			selectedFormat(target.value as ExportFormat)
		}

		const duration = ctx.session.index.getItemDuration(timeline.rootId)

		const estimateFileSize = () => {
			const size = ((+bitrate() / 1000) * (duration / 1000)) / 8
			return size.toFixed(1)
		}

		function formatTime(time: Ms) {
			const totalSeconds = Math.floor(time / 1000)

			const hours = Math.floor(totalSeconds / 3600)
			const minutes = Math.floor((totalSeconds % 3600) / 60)
			const seconds = totalSeconds % 60

			const h = hours.toString().padStart(2, '0')
			const m = minutes.toString().padStart(2, '0')
			const s = seconds.toString().padStart(2, '0')

			return `${h}h:${m}m:${s}s`
		}

		return html`
			<div class="modal">
				<div class="grid">

					<div class="label">Resolution</div>
					<div class="value">${state.resolution}</div>

					<div class="label">Frame Rate</div>
					<div class="value">${state.timebase} fps</div>

					<div class="label">Codec</div>
					<wa-select
						size="small"
						value=${selectedCodec()}
						@change=${setCodec}
					>
						${codecOptions.map(option => html`
							<wa-option
								value=${option.value}
								selected=${option.value === selectedCodec()}
							>
								${option.label}
							</wa-option>
						`)}
					</wa-select>

					<div class="label">Format</div>
						<wa-select
							size="small"
							value=${selectedFormat()}
							@change=${setFormat}
						>
						${codecSupportedFormats[selectedCodec()].map(format => html`
							<wa-option
								value=${format}
								selected=${format === selectedFormat()}
							>
								${format.toUpperCase()}
							</wa-option>
						`)}

						</wa-select>

					<div class="label">Bit rate</div>
					<wa-select
						size="small"
						value=${selectedQuality()}
						@change=${setQuality}
					>
						${qualityOptions.map(option => html`
							<wa-option
								value=${option.value}
								selected=${option.value === selectedQuality()}
							>
								${getQualityLabel(option)}
							</wa-option>
						`)}
					</wa-select>

					${selectedQuality() === "custom"
						? html`
								<div class=label></div>
								<wa-input
									@change=${setBitrate}
									class="value custom"
									label="Kbps"
									type=number
									min=0
									value=${String(bitrate())}
									size=small
								>
								</wa-input>`
						: null
					}
				</div>

				<div class="modal-footer export">
					<div class=info>
						<span>Duration: ${formatTime(duration)}</span>
						<span class=spacer></span>
						<span>Size: ~${estimateFileSize()}MB</span>
					</div>

					<div>
						<wa-button
							class=cancel
							variant="neutral"
							@click=${modal.cancel}
						>
							Cancel
						</wa-button>

						<wa-button
							class="export-button"
							variant="neutral"
							@click=${() => modal.resolve({
								codec: selectedCodec(),
								bitrate: bitrate(),
								format: selectedFormat()
							})}
						>
							Export
						</wa-button>
					</div>
				</div>
			</div>
		`
	})()
})
