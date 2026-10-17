
import {transcriberModels} from "./transcriber.js"
import {backgroundRemoverModels} from "./bg-remover.js"

type ModelMetadata = {
	label: string
	purpose: string
}

const metadata = (
		models: readonly {id: string, name: string}[],
		purpose: string,
	) => models.map(({id, name}) => [id, {label: name, purpose}] as const)

export const modelMetadata: Record<string, ModelMetadata> = Object.fromEntries([
	...metadata(transcriberModels, "Automatic speech recognition"),
	...metadata(backgroundRemoverModels, "Background removal"),
])
