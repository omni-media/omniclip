
import {html} from 'lit'
import {shadow, useCss, useOnce, useSignal} from '@e280/sly'

import styleCss from './style.css.js'
import modalCss from '../../../../context/parts/modal/modal.css.js'

import {settings} from './constants.js'
import {aspectRatioOptions, getResolutions} from './utils.js'
import {
	CachedModel,
	formatBytes,
	inspectModelStorage,
	ModelStorage,
	removeCachedModel,
} from '../../models/storage.js'
import {ModalDefinition} from '../../../../context/parts/modal/types.js'

import {Settings} from '../../../../context/parts/state.js'
import '@awesome.me/webawesome/dist/components/icon/icon.js'
import '@awesome.me/webawesome/dist/components/button/button.js'
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

		const storageError = useSignal("")
		const removing = useSignal<string | null>(null)
		const storage = useSignal<ModelStorage | null>(null)
		const selected = useSignal<Settings>({...ctx.strata.settings.state})

		const refreshStorage = async () => {
			storageError("")
			try {
				storage(await inspectModelStorage())
			}
			catch (error) {
				storageError(error instanceof Error ? error.message : "Could not inspect model storage.")
			}
		}

		const removeModel = async (model: CachedModel) => {
			removing(model.id)
			try {
				await removeCachedModel(model)
				await refreshStorage()
			}
			catch (error) {
				storageError(error instanceof Error ? error.message : "Could not remove the cached model.")
			}
			finally {
				removing(null)
			}
		}

		useOnce(() => refreshStorage())

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
			<label class="field">
				<span>${label}</span>
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
			</label>
		`

		function renderModelStorage(
			storage: ModelStorage | null,
			error: string,
			removing: string | null,
			remove: (model: CachedModel) => Promise<void>,
		) {
			if (error)
				return html`<div class="storage-status error">${error}</div>`

			if (!storage)
				return html`<div class="storage-status">Calculating…</div>`

			return html`
				${storage.models.length
					? storage.models.map(model => html`
						<div class="model-row">
							<span class="model-name">
								<span>${model.label}</span>
								<small>${model.purpose}</small>
							</span>
							<span class="model-size">${formatBytes(model.size)}</span>
							<wa-button
								size="small"
								variant="neutral"
								?disabled=${removing !== null}
								@click=${() => remove(model)}
							>
								${removing === model.id ? "Removing…" : "Remove"}
							</wa-button>
						</div>
					`)
					: html`<div class="storage-status">No AI models cached.</div>`}
				<div class="storage-summary">
					<span>AI models ${formatBytes(storage.modelsUsed)}</span>
					<span>${formatBytes(storage.used)} of ${formatBytes(storage.quota)} used · ${formatBytes(storage.available)} free</span>
				</div>
			`
		}

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

						<section class="model-storage">
							<div class="section-label">AI MODEL STORAGE</div>
							${renderModelStorage(
								storage.value,
								storageError.value,
								removing.value,
								removeModel,
							)}
						</section>

					</div>
				</div>

				<div class="modal-footer">
					<wa-button variant="neutral" @click=${modal.cancel}>
						Cancel
					</wa-button>

					<wa-button
						variant="neutral"
						@click=${() => modal.resolve(selected.value)}
					>
						Apply
					</wa-button>
				</div>
			</div>
		`
	})()
})

