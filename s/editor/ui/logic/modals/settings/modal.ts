
import {html} from 'lit'
import {shadow, useCss, useSignal} from '@e280/sly'

import styleCss from './style.css.js'
import modalCss from '../../../../context/parts/modal/modal.css.js'

import {settings} from './constants.js'
import {ModalDefinition} from '../../../../context/parts/modal/types.js'
import {aspectRatioOptions, getResolutions, resolutionToAspectRatio} from './utils.js'

import {Settings} from '../../../../context/parts/state.js'
import '@awesome.me/webawesome/dist/components/icon/icon.js'
import '@awesome.me/webawesome/dist/components/option/option.js'
import '@awesome.me/webawesome/dist/components/select/select.js'

export const settingsModal = (): ModalDefinition<Settings> => ({
	label: html`
		<div>
			<wa-icon name="gear"></wa-icon>
			<span>Sequence Settings</span>
		</div>
	`,

	render: (ctx, modal) => shadow(() => {
		useCss(modalCss, styleCss)

		const selected = useSignal<Settings>({...ctx.strata.settings.state})

		const set = (key: keyof Settings, value: string) => {
			const next = {...selected.value, [key]: value}
			if (key === 'aspectRatio')
  			next.resolution = getResolutions(value)[0]?.value
			selected.value = next
		}

		const renderSelect = (
			label: string,
			key: keyof Settings,
			options: readonly {value: string | number | boolean, label: string}[],
		) => html`
			<div class="field">
				<label>${label}</label>
				<wa-select
					size=small
					value=${selected.value[key]}
					@change=${(e: Event) =>
						set(key, (e.target as HTMLSelectElement).value)}
				>
					${options.map(o => html`
						<wa-option
							value=${o.value}
							selected=${selected.value[key] === o.value}
						>
							${o.label}
						</wa-option>
					`)}
				</wa-select>
			</div>
		`

		return html`
			<div class="modal">

				<div class="modal-body">
					<div class="settings-modal">
						<section class="video">
							<div class="section-label">VIDEO</div>
							${renderSelect('Resolution', 'resolution', getResolutions(selected.value.aspectRatio))}
							${renderSelect('Drop frame', 'dropFrame', settings.dropFrame.options)}
							${renderSelect('Aspect Ratio', 'aspectRatio', aspectRatioOptions)}
							${renderSelect('Timebase', 'timebase', settings.timebase.options)}
							${renderSelect('Color Space', 'colorSpace', settings.colorSpace.options)}
						</section>

						<section class="audio">
							<div class="section-label">AUDIO</div>
							${renderSelect('Sample Rate', 'sampleRate', settings.sampleRate.options)}
							${renderSelect('Channels', 'channels', settings.channels.options)}
						</section>

						<section class="preview">
							<div class="preview-label">PREVIEW</div>
							<div class="preview-box">
								<span
									class=res
									style="aspect-ratio: ${resolutionToAspectRatio(selected.value.resolution)}"
								>
									${selected.value.resolution}
								</span>
								<span>
									${selected.value.timebase} fps ·
									${selected.value.dropFrame} ·
									${selected.value.colorSpace}
								</span>
							</div>
						</section>
					</div>
				</div>

				<div class="modal-footer">
					<wa-button variant="neutral" @click=${modal.cancel}>
						Cancel
					</wa-button>

					<wa-button
						variant="brand"
						@click=${() => modal.resolve(selected.value)}
					>
						Apply
					</wa-button>
				</div>
			</div>
		`
	})()
})
