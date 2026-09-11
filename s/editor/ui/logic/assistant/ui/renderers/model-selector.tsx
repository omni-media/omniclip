
import {CheckIcon, ChevronDownIcon, SparklesIcon} from "lucide-react"
import WaDropdown from "@awesome.me/webawesome/dist/react/dropdown/index.js"
import WaDropdownItem from "@awesome.me/webawesome/dist/react/dropdown-item/index.js"
import {assistantModels, type AssistantModelId} from "../../../models/assistant.js"

export const ModelSelector = ({
	value,
	onChange,
}: {
	value: AssistantModelId
	onChange: (id: AssistantModelId) => void
}) => {
	const selected = assistantModels.find(model => model.id === value)!

	return <WaDropdown
		className="model-picker"
		placement="top-start"
		distance={8}
		onWaSelect={event => onChange(
			(event.detail.item as HTMLElementTagNameMap["wa-dropdown-item"]).value as AssistantModelId,
		)}>
		<button className="model-trigger" type="button" slot="trigger">
			<SparklesIcon className="model-icon" />
			<span className="model-name">{selected.name}</span>
			<span className="model-source">{selected.source}</span>
			<ChevronDownIcon className="model-caret" />
		</button>

		{assistantModels.map(model => <WaDropdownItem
			className="model-option"
			key={model.id}
			value={model.id}
			data-selected={model.id === value || undefined}>
			<SparklesIcon slot="icon" />
			{model.name}
			<CheckIcon className="model-check" slot="details" />
		</WaDropdownItem>)}
	</WaDropdown>
}

