
import {Comrade} from "@e280/comrade"
import {AutoModelForImageTextToText, AutoProcessor, ModelRegistry, type ProgressInfo} from "@huggingface/transformers"

import {ask} from "./parts/ask.js"
import {resolveRuntime} from "./parts/resolve-runtime.js"
import {exposeErrors} from "../utils/expose-errors.js"
import type {AssistantBackend, AssistantSchematic} from "./parts/types.js"
import type {AssistantDtype} from "../models/assistant.js"

let backend!: AssistantBackend
let loaded: string | undefined
const availableDtypes = (modelId: string) =>
	ModelRegistry.get_available_dtypes(modelId) as Promise<AssistantDtype[]>

await Comrade.worker<AssistantSchematic>(({host}) => ({
	availableDtypes: exposeErrors(availableDtypes),
	prepare: exposeErrors(async(options, settings) => {
		const report = (progress: number, text: string) => host.loading({progress, text})

		const key = `${options.id}:${settings.device}:${settings.dtype}`
		if (loaded === key)
			return

		loaded = undefined
		await backend?.model.dispose()

		const {id, name, contextLength} = options
		const runtime = await resolveRuntime(await availableDtypes(id), settings)

		report(0, `Loading ${name}…`)

		const progress_callback = (info: ProgressInfo) => {
			if (info.status === "progress_total")
				report(info.progress / 100, `Downloading ${name}…`)
		}

		const processor = await AutoProcessor.from_pretrained(id, {progress_callback})
		const model = await AutoModelForImageTextToText.from_pretrained(id, {
			...runtime,
			progress_callback,
		})

		backend = {processor, model, contextLength}
		loaded = key

		report(1, `${name} loaded`)
	}),
	ask: exposeErrors((messages, settings) =>
		ask(backend, messages, settings, text => host.deliverText(text))),
}))
