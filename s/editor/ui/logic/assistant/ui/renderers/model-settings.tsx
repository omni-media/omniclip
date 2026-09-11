
import {useEffect, useState} from "react"
import {RotateCcwIcon} from "lucide-react"
import type {Assistant} from "../../assistant.js"
import type {DataType, DeviceType} from "@huggingface/transformers"
import WaOption from "@awesome.me/webawesome/dist/react/option/index.js"
import WaSelect from "@awesome.me/webawesome/dist/react/select/index.js"
import WaSlider from "@awesome.me/webawesome/dist/react/slider/index.js"
import WaDivider from "@awesome.me/webawesome/dist/react/divider/index.js"
import WaPopover from "@awesome.me/webawesome/dist/react/popover/index.js"
import WaNumberInput from "@awesome.me/webawesome/dist/react/number-input/index.js"
import {assistantModels, defaultAssistantSettings, type AssistantDtype, type AssistantModelId, type AssistantSettings} from "../../../models/assistant.js"

const devices: [DeviceType, string][] = [
	["auto", "Auto"],
	["gpu", "GPU"],
	["webgpu", "WebGPU"],
	["webnn", "WebNN"],
	["webnn-gpu", "WebNN GPU"],
	["webnn-npu", "WebNN NPU"],
	["webnn-cpu", "WebNN CPU"],
	["wasm", "CPU (WASM)"],
]

export const ModelSettings = ({
	assistant,
	modelId,
	settings,
	onChange,
}: {
	assistant: Assistant
	modelId: AssistantModelId
	settings: AssistantSettings
	onChange: (settings: AssistantSettings) => void
}) => {
	const [dtypes, setDtypes] = useState<AssistantDtype[]>([])
	useEffect(() => {
		assistant.availableDtypes(modelId).then(setDtypes, () => {})
	}, [assistant, modelId])

	const model = assistantModels.find(model => model.id === modelId)!
	const contextLengths = [2_048, 4_096, 8_192, 16_384, 32_768]
		.filter(length => length <= model.contextLength)
	const update = (change: Partial<AssistantSettings>) =>
		onChange({...settings, ...change})

	return <WaPopover
		className="model-settings"
		for="assistant-settings"
		placement="top-start"
		distance={8}
		withoutArrow>
		<div className="settings-heading">
			<div><strong>Model settings</strong><span>{model.name}</span></div>
			<button type="button" title="Reset settings"
				onClick={() => onChange(defaultAssistantSettings)}>
				<RotateCcwIcon />
			</button>
		</div>

		<div className="settings-section">
			<span className="settings-title">Runtime</span>
			<div className="settings-columns">
				<WaSelect label="Device" size="small" value={settings.device}
					onChange={event => update({device: event.currentTarget.value as DeviceType})}>
					{devices.map(([value, label]) =>
						<WaOption key={value} value={value}>{label}</WaOption>
					)}
				</WaSelect>

				<WaSelect label="Precision" size="small" value={settings.dtype}
					onChange={event => update({dtype: event.currentTarget.value as DataType})}>
					<WaOption value="auto">Auto</WaOption>
					{dtypes.map(dtype =>
						<WaOption key={dtype} value={dtype}>{dtype.toUpperCase()}</WaOption>
					)}
				</WaSelect>
			</div>
		</div>

		<WaDivider />

		<div className="settings-section">
			<span className="settings-title">Generation</span>
			<div className="settings-columns">
				<WaSelect label="Context" size="small" value={String(settings.contextLength)}
					onChange={event => {
						const value = event.currentTarget.value
						update({contextLength: value === "auto" ? value : Number(value)})
					}}>
					<WaOption value="auto">Auto</WaOption>
					{contextLengths.map(length =>
						<WaOption key={length} value={String(length)}>{length / 1_024}K</WaOption>
					)}
				</WaSelect>

				<WaNumberInput label="Max tokens" size="small" min={32} max={4_096} step={32}
					value={String(settings.maxOutputTokens)}
					onChange={event => update({maxOutputTokens: Number(event.currentTarget.value)})} />
				<WaNumberInput label="Top K" size="small" min={0} max={200}
					value={String(settings.topK)}
					onChange={event => update({topK: Number(event.currentTarget.value)})} />
			</div>

			<label className="setting-slider">
				<span>Temperature <output>{settings.temperature.toFixed(1)}</output></span>
				<WaSlider size="small" min={0} max={2} step={0.1} value={settings.temperature}
					onInput={event => update({temperature: event.currentTarget.value})} />
			</label>

			<label className="setting-slider">
				<span>Top P <output>{settings.topP.toFixed(2)}</output></span>
				<WaSlider size="small" min={0.05} max={1} step={0.05} value={settings.topP}
					onInput={event => update({topP: event.currentTarget.value})} />
			</label>

			<label className="setting-slider">
				<span>Repetition penalty <output>{settings.repetitionPenalty.toFixed(2)}</output></span>
				<WaSlider size="small" min={0.5} max={2} step={0.05} value={settings.repetitionPenalty}
					onInput={event => update({repetitionPenalty: event.currentTarget.value})} />
			</label>
		</div>
	</WaPopover>
}

