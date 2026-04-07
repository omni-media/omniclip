
import {html} from "lit"
import {view} from "@e280/sly"

import styleCss from "./style.css.js"
import modalCss from "../../../../context/parts/modal/modal.css.js"
import {ModalDefinition} from "../../../../context/parts/modal/types.js"
import {codecOptions, ExportCodec, ExportBitrate, ExportResult, qualityOptions} from "./constants.js"

import "@awesome.me/webawesome/dist/components/icon/icon.js"
import "@awesome.me/webawesome/dist/components/button/button.js"
import "@awesome.me/webawesome/dist/components/option/option.js"
import "@awesome.me/webawesome/dist/components/select/select.js"

export const exportModal = (): ModalDefinition<ExportResult> => ({
	label: html`
		<div class="header">
			<wa-icon name="download"></wa-icon>
			<span>Export Project</span>
		</div>
	`,

	render: (ctx, modal) => view(use => {
		use.styles(modalCss, styleCss)

		const state = ctx.strata.settings.state

		const selectedCodec = use.signal<ExportCodec>("h264")
		const selectedBitrate = use.signal<ExportBitrate>("high")

		const setBitrate = (e: Event) => {
			const target = e.target as HTMLSelectElement
			const bitrate = target.value as ExportBitrate
			selectedBitrate(bitrate)
		}

		const setCodec = (e: Event) => {
			const target = e.target as HTMLSelectElement
			const codec = target.value as ExportCodec
			selectedCodec(codec)
		}

		const getFormat = (codec: ExportCodec) => {
			if(codec === "h264")
				return "mp4"
			else return "webm"
		}

		return () => html`
			<div class="modal">
				<div class="grid">
					<div class="label">Format</div>
					<div class="value">
						${selectedCodec.value.toUpperCase()}
						${getFormat(selectedCodec()).toUpperCase()}
					</div>

					<div class="label">Resolution</div>
					<div class="value">${state.resolution}</div>

					<div class="label">Frame Rate</div>
					<div class="value">${state.timebase} fps</div>

					<div class="label">Codec</div>
					<wa-select
						size="small"
						value=${selectedCodec.value}
						@change=${setCodec}
					>
						${codecOptions.map(option => html`
							<wa-option
								value=${option.value}
								selected=${option.value === selectedCodec.value}
							>
								${option.label}
							</wa-option>
						`)}
					</wa-select>

					<div class="label">Bit rate</div>
					<wa-select
						size="small"
						value=${selectedBitrate.value}
						@change=${setBitrate}
					>
						${qualityOptions.map(option => html`
							<wa-option
								value=${option.value}
								selected=${option.value === selectedBitrate.value}
							>
								${option.label}
							</wa-option>
						`)}
					</wa-select>
				</div>

				<div class=modal-footer>
					<wa-button
						class="export-button"
						variant="brand"
						@click=${() => modal.resolve({
							codec: selectedCodec.value,
							bitrate: selectedBitrate.value,
						})}
					>
						Start Export
					</wa-button>
				</div>
			</div>
		`
	})()
})

